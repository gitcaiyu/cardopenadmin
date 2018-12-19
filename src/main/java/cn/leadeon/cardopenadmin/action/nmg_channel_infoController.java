package cn.leadeon.cardopenadmin.action;

import cn.leadeon.cardopenadmin.common.resBody.CardResponse;
import cn.leadeon.cardopenadmin.entity.nmg_channel_info;
import cn.leadeon.cardopenadmin.service.nmg_channel_infoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

@RestController
public class nmg_channel_infoController {

    @Autowired
    private nmg_channel_infoService nmg_channel_infoService;

    /**
     * 后台渠道管理页面展示
     * @param nmg_channel_info
     * @param httpSession
     * @return
     */
    @RequestMapping(value = "/channel",method = RequestMethod.POST)
    @CrossOrigin
    public CardResponse channel(@RequestBody nmg_channel_info nmg_channel_info, HttpSession httpSession) {
        return nmg_channel_infoService.channel(nmg_channel_info,httpSession);
    }

}
