package cn.leadeon.cardopenadmin.action;

import cn.leadeon.cardopenadmin.common.resBody.CardResponse;
import cn.leadeon.cardopenadmin.entity.nmg_user_info;
import cn.leadeon.cardopenadmin.service.nmg_user_infoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import javax.validation.Valid;

@RestController
public class nmg_user_infoController {

    @Autowired
    private nmg_user_infoService nmg_user_infoService;

    /**
     * 用户登录
     * @param nmg_user_info
     * @return
     */
    @RequestMapping(value = "/userLogin",method = RequestMethod.POST)
    @CrossOrigin
    public CardResponse userLogin(@RequestBody @Valid nmg_user_info nmg_user_info, HttpSession session) {
        return nmg_user_infoService.userLogin(nmg_user_info,session);
    }

}
