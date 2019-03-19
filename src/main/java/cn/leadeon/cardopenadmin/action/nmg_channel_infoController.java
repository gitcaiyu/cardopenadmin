package cn.leadeon.cardopenadmin.action;

import cn.leadeon.cardopenadmin.common.resBody.CardResponse;
import cn.leadeon.cardopenadmin.entity.nmg_channel_info;
import cn.leadeon.cardopenadmin.service.nmg_channel_infoService;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import java.io.IOException;
import java.io.OutputStream;

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
     * @param httpServletRequest
     * @return
     * @throws IOException
     */
    @GetMapping(value = "/channelExport")
    @ResponseBody
    public void channelExport(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws IOException {
        nmg_channel_info nmg_channel_info = new nmg_channel_info();
        nmg_channel_info.setCity(httpServletRequest.getParameter("city"));
        nmg_channel_info.setCounty(httpServletRequest.getParameter("county"));
        nmg_channel_info.setChannelName(httpServletRequest.getParameter("channelName"));
        nmg_channel_info.setChannelId(httpServletRequest.getParameter("channelId"));
        nmg_channel_info.setChannelType(httpServletRequest.getParameter("channelType"));
        nmg_channel_info.setChargeName(httpServletRequest.getParameter("chargeName"));
        nmg_channel_info.setChargeTel(httpServletRequest.getParameter("chargeTel"));
        nmg_channel_infoService.channelExport(nmg_channel_info,httpServletRequest,httpServletResponse);
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

    /**
     * 导入信息之前需要先下载模板
     * @param httpServletRequest
     * @return
     */
    @RequestMapping(value = "/channelTemplate")
    @ResponseBody
    public CardResponse channelTemplate(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws IOException {
        return nmg_channel_infoService.channelTemplate(httpServletRequest,httpServletResponse);
    }

}
