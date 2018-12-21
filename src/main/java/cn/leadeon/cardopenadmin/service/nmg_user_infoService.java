package cn.leadeon.cardopenadmin.service;

import cn.leadeon.cardopenadmin.common.CodeEnum;
import cn.leadeon.cardopenadmin.common.resBody.CardResponse;
import cn.leadeon.cardopenadmin.entity.nmg_user_info;
import cn.leadeon.cardopenadmin.mapper.nmg_user_infoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@Service
public class nmg_user_infoService {

    @Autowired
    private nmg_menu_infoService nmg_menu_infoService;

    @Autowired
    private nmg_user_infoMapper nmg_user_infoMapper;

    public CardResponse userLogin(nmg_user_info nmg_user_info, HttpSession session) {
        CardResponse cardResponse = new CardResponse();
        Map param = new HashMap();
        param.put("userName",nmg_user_info.getUserName());
        param.put("userPass",nmg_user_info.getUserPass());
        nmg_user_info userInfo = nmg_user_infoMapper.userValid(param);
        try {
            cardResponse = nmg_menu_infoService.menuList(userInfo.getUserRole());
            session.setAttribute("userInfo",userInfo);
        } catch (Exception e) {
            cardResponse.setResCode(CodeEnum.loginFaild.getCode());
            cardResponse.setResDesc(CodeEnum.loginFaild.getDesc());
        }
        System.out.println(cardResponse.getResBody().toString());
        return cardResponse;
    }

}
