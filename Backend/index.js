const app = require("express")();
const cors = require("cors");

require("./db/mongoose");
require("dotenv").config();

/* -------------------------------------------------------------------------- */
/*                                Routes Steup                                */
/* -------------------------------------------------------------------------- */
const adminRoutes = require("./router/admin");
const projectRoutes = require("./router/projects");
app.use(cors());
app.use("/admin", adminRoutes);
app.use("/projects", projectRoutes);


/* -------------------------------------------------------------------------- */
/*                               Server Startup                               */
/* -------------------------------------------------------------------------- */
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
