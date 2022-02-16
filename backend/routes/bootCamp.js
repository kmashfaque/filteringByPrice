import express from "express";
import {
  getAllBootCamps,
  createNewBootCamp,
  updateBootcampById,
  deleteBootCampId,
} from "../controllers/bootcampsController.js";
const router = express.Router();

//@route -/api/v1/bootcapms/
router.route("/").get(getAllBootCamps).post(createNewBootCamp);

//@route -/api/v1/bootcamps/someid/
router.route("/:id").put(updateBootcampById).delete(deleteBootCampId);

export default router;
