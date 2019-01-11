package cn.leadeon.cardopenadmin.action;

import cn.leadeon.cardopenadmin.common.resBody.CardResponse;
import cn.leadeon.cardopenadmin.entity.nmg_channel_info;
import cn.leadeon.cardopenadmin.service.nmg_channel_infoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import java.io.IOException;

@Controller
@CrossOrigin
public class nmg_channel_infoController {

    @Autowired
    private nmg_channel_infoService nmg_channel_infoService;

    @GetMapping(value = "/channel")
    public String channel() {
        return "/pages/channel.html";
    }

    /**
     * 后台渠道管理页面展示
     * @param nmg_channel_info
     * @param httpServletRequest
     * @return
     */
    @RequestMapping(value = "/channelInfo",method = RequestMethod.POST)
    @ResponseBody
    public CardResponse channel(@RequestBody nmg_channel_info nmg_channel_info, HttpServletRequest httpServletRequest) {
        return nmg_channel_infoService.channel(nmg_channel_info,httpServletRequest);
    }

    /**
     * 新增渠道信息
     * @param nmg_channel_info
     * @return
     */
    @RequestMapping(value = "/channelAdd",method = RequestMethod.POST)
    @ResponseBody
    public CardResponse channelAdd(@RequestBody nmg_channel_info nmg_channel_info) {
        return nmg_channel_infoService.channelAdd(nmg_channel_info);
    }

    /**
     * 渠道信息删除
     * @param data
     * @return
     */
    @RequestMapping(value = "/channelDel",method = RequestMethod.POST)
    @ResponseBody
    public CardResponse channelDel(@RequestBody String data) {
        return nmg_channel_infoService.channelDel(data);
    }

    /**
     * 渠道信息导出
     * @param nmg_channel_info
     * @param httpServletRequest
     * @return
     * @throws IOException
     */
    @PostMapping(value = "/channelExport")
    @ResponseBody
    public CardResponse channelExport(@RequestBody nmg_channel_info nmg_channel_info,HttpServletRequest httpServletRequest) throws IOException {
        return nmg_channel_infoService.channelExport(nmg_channel_info,httpServletRequest);
    }

    /**
     * 批量导入
     * @param file
     * @return
     */
    @PostMapping(value = "/batchImport")
    @ResponseBody
    public CardResponse batchImport(@RequestParam MultipartFile file) throws IOException {
        return nmg_channel_infoService.batchImport(file);
    }

}
