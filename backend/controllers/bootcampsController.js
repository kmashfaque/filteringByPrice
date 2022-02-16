import Bootcamp from "../models/Bootcampmodel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import ErrorResponse from "../utills/errorResaponse.js";

const getAllBootCamps = asyncHandler(async (req, res, next) => {
  let query;

  let uiValues = {
    filtering: {},
    sorting: {},
  };

  const reqQuery = { ...req.query };

  const removeFields = ["sort"];
  removeFields.forEach((val) => delete reqQuery[val]);

  const filterKeys = Object.keys(reqQuery);
  const filterValues = Object.values(reqQuery);

  filterKeys.forEach(
    (val, idx) => (uiValues.filtering[val] = filterValues[idx])
  );

  let queryStr = JSON.stringify(reqQuery);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = Bootcamp.find(JSON.parse(queryStr));

  if (req.query.sort) {
    const sortByArr = req.query.sort.split(",");

    sortByArr.forEach((val) => {
      let order;

      if (val[0] === "-") {
        order = "descending";
      } else {
        order = "ascending";
      }
      uiValues.sorting[val.replace("-", "")] = order;
    });
    const sortBystr = sortByArr.join(" ");

    query = query.sort(sortBystr);
  } else {
    query = query.sort("-price");
  }
  const bootcamp = await query;

  const maxPrice = await Bootcamp.find()
    .sort({ price: -1 })
    .limit(1)
    .select("-_id price");

  const minPrice = await Bootcamp.find()
    .sort({ price: 1 })
    .limit(1)
    .select("-_id price");

  uiValues.maxPrice = maxPrice[0].price;
  uiValues.minPrice = minPrice[0].price;

  res.status(200).json({
    success: true,
    data: bootcamp,
    uiValues,
  });
});

const createNewBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

const updateBootcampById = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`bootcamp ${req.params.id} was not found`, 404)
    );
  }

  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

const deleteBootCampId = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`bootcamp ${req.params.id} was not found`, 404)
    );
  }
  await bootcamp.remove();

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

export {
  getAllBootCamps,
  createNewBootCamp,
  updateBootcampById,
  deleteBootCampId,
};
