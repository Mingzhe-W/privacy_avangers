//导入路由相关组件
import { BrowserRouter, Routes, Route } from "react-router-dom";
//导入组件
import Home from "../views/Home/Home"
import Dashboard from "../views/Dashboard/Dashboard";

//路由配置文件
function Router() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    )
}
export default Router;