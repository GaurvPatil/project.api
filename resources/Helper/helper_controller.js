import { Guide } from "../Guide/guide_model.js";
import { Department } from "../Department/dep_model.js";

const getDashBoardCount = async (req, res) => {
  try {
    const guideCount = await Guide.count({});
    const departmentCount = await Department.count({});

    res.status(200).json({
      status: 200,
      body: req.body,
      message: "SUCCESS",
      data: [
        { name: "Total - Guides", count: guideCount },
        { name: "Total - Departments ", count: departmentCount },
      ],
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      status: 500,
      body: req.body,
      message: "ERROR",
      data: { guideCount, departmentCount },
    });
  }
};

export { getDashBoardCount };
