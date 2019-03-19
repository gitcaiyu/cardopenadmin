package cn.leadeon.cardopenadmin.action;

import cn.leadeon.cardopenadmin.common.resBody.CardResponse;
import cn.leadeon.cardopenadmin.entity.nmg_user_info;
import cn.leadeon.cardopenadmin.entity.nmg_user_role;
import cn.leadeon.cardopenadmin.service.nmg_user_infoService;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import java.io.IOException;

@RestController
@CrossOrigin
public class nmg_user_infoController {

    @Autowired
    private nmg_user_infoService nmg_user_infoService;

    /**
     * 用户登录
     * @param nmg_user_info
     * @return
     */
    @RequestMapping(value = "/userLogin",method = RequestMethod.POST)
    public CardResponse userLogin(@RequestBody @Valid nmg_user_info nmg_user_info, HttpServletRequest httpServletRequest) {
        return nmg_user_infoService.userLogin(nmg_user_info,httpServletRequest);
    }

    /**
     * 退出销毁session
     * @param httpServletRequest
     * @return
     */
    @PostMapping(value = "/userLogout")
    public CardResponse userLogout(HttpServletRequest httpServletRequest) {
        HttpSession httpSession = httpServletRequest.getSession();
        httpSession.removeAttribute("userInfo");
        return new CardResponse();
    }

    /**
     * 当前登录用户菜单
     * @param httpServletRequest
     * @return
     */
    @PostMapping(value = "/menu")
    public CardResponse menu(HttpServletRequest httpServletRequest) {
        return nmg_user_infoService.menu(httpServletRequest);
    }

    /**
     * 用户管理
     * @param data
     * @return
     */
    @PostMapping(value = "/userManage")
    public CardResponse userManage(@RequestBody String data) {
        return nmg_user_infoService.userManage(data);
    }

    /**
     * 新增用户
     * @param nmg_user_info
     * @param httpServletRequest
     * @return
     */
    @PostMapping(value = "/userAdd")
    public CardResponse userAdd(@RequestBody nmg_user_info nmg_user_info,HttpServletRequest httpServletRequest) {
        return nmg_user_infoService.userAdd(nmg_user_info,httpServletRequest);
    }

    /**
     * 用户删除
     * @param data
     * @return
     */
    @PostMapping(value = "/userDel")
    public CardResponse userDel(@RequestBody String data) {
        return nmg_user_infoService.userDel(data);
    }

    /**
     * 用户导入
     * @param file
     * @return
     */
    @PostMapping(value = "/userImport")
    public CardResponse userImport(@RequestParam MultipartFile file,HttpServletRequest httpServletRequest) throws IOException {
        return nmg_user_infoService.userImport(file,httpServletRequest);
    }

    /**
     * 用户导出
     * @param httpServletRequest
     * @return
     */
    @GetMapping(value = "/userExport")
    public void userExport(HttpServletRequest httpServletRequest,HttpServletResponse httpServletResponse) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("userName",httpServletRequest.getParameter("userName"));
        jsonObject.put("userTel",httpServletRequest.getParameter("userTel"));
        jsonObject.put("userRole",httpServletRequest.getParameter("userRole"));
        nmg_user_infoService.userExport(httpServletRequest,httpServletResponse,jsonObject);
    }

    /**
     * 角色管理
     * @param data
     * @return
     */
    @PostMapping(value = "/roleManage")
    public CardResponse roleManage(@RequestBody String data) {
        return nmg_user_infoService.roleManage(data);
    }

    /**
     * 角色新增
     * @param nmg_user_role
     * @param httpServletRequest
     * @return
     */
    @PostMapping(value = "/roleAdd")
    public CardResponse roleAdd(@RequestBody nmg_user_role nmg_user_role,HttpServletRequest httpServletRequest) {
        return nmg_user_infoService.roleAdd(nmg_user_role,httpServletRequest);
    }

    /**
     * 角色删除
     * @param data
     * @return
     */
    @PostMapping(value = "/roleDel")
    public CardResponse roleDel(@RequestBody String data){
        return nmg_user_infoService.roleDel(data);
    }

    /**
     * 用户信息导入模板
     */
    @RequestMapping(value = "/userTemplate")
    public CardResponse userTemplate(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws IOException {
        return nmg_user_infoService.userTemplate(httpServletRequest,httpServletResponse);
    }
}
