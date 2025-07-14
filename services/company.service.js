const mongoose = require("mongoose");
const Company = require("../models/Company");
const ObjectId = mongoose.Types.ObjectId;

exports.getCompaniesService = async (filters, queries) => {
  const companies = await Company.find(filters)
    .skip(queries.skip)
    .limit(queries.limit)
    .select(queries.fields)
    .sort(queries.sortBy)
    .populate({
      path: "managerName",
      select: "-password -__v -createdAt -updatedAt -role -status -appliedJobs",
    });

  const total = await Company.countDocuments(filters);
  const page = Math.ceil(total / queries.limit) || 1;

  return { total, count: companies.length, page, companies };
};

exports.getCompanyByIdService = async (id) => {
  const company = await Company.findOne({ _id: id })
    // populate managerName without password
    .populate({
      path: "managerName",
      select: "-password -__v -createdAt -updatedAt -role -status -appliedJobs",
    })
    .populate({
      path: "jobPosts",
      select: "-applications",
    });
  // .populate("suppliledBy.id")
  // .populate("brand.id");
  return company;
};

exports.createCompanyService = async (data) => {
  const company = await Company.create(data);
  //send result with populated with managerName
  const result = await Company.findOne({ _id: company._id }).populate({
    path: "managerName",
    select: "-password -__v -createdAt -updatedAt -role -status",
  });
  return result;
};


