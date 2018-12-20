package cn.leadeon.cardopenadmin.action;

import cn.leadeon.cardopenadmin.common.resBody.CardResponse;
import cn.leadeon.cardopenadmin.entity.nmg_channel_info;
import cn.leadeon.cardopenadmin.service.nmg_channel_infoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import java.io.IOException;

@RestController
@CrossOrigin
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
    public CardResponse channel(@RequestBody nmg_channel_info nmg_channel_info, HttpSession httpSession) {
        return nmg_channel_infoService.channel(nmg_channel_info,httpSession);
    }

    /**
     * 新增渠道信息
     * @param nmg_channel_info
     * @return
     */
    @RequestMapping(value = "/channelAdd",method = RequestMethod.POST)
    public CardResponse channelAdd(@RequestBody nmg_channel_info nmg_channel_info) {
        return nmg_channel_infoService.channelAdd(nmg_channel_info);
    }

    /**
     * 渠道更新方法
     * @param nmg_channel_info
     * @return
     */
    @RequestMapping(value = "/channelUpdate",method = RequestMethod.POST)
    public CardResponse channelUpdate(@RequestBody @Valid nmg_channel_info nmg_channel_info) {
        return nmg_channel_infoService.channelUpdate(nmg_channel_info);
    }

    /**
     * 渠道信息删除
     * @param nmg_channel_info
     * @return
     */
    @RequestMapping(value = "/channelDel",method = RequestMethod.POST)
    public CardResponse channelDel(@RequestBody @Valid nmg_channel_info nmg_channel_info) {
        return nmg_channel_infoService.channelDel(nmg_channel_info);
    }

    /**
     * 渠道信息导出
     * @param httpSession
     * @return
     * @throws IOException
     */
    @PostMapping(value = "/channelExport")
    public CardResponse channelExport(HttpSession httpSession) throws IOException {
        return nmg_channel_infoService.channelExport(httpSession);
    }

    /**
     * 批量导入
     * @param file
     * @return
     */
    @PostMapping(value = "/batchImport")
    public CardResponse batchImport(@RequestParam MultipartFile file) throws IOException {
        return nmg_channel_infoService.batchImport(file);
    }

}
