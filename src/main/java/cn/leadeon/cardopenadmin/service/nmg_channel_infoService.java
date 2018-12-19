package cn.leadeon.cardopenadmin.service;

import cn.leadeon.cardopenadmin.common.resBody.CardResponse;
import cn.leadeon.cardopenadmin.entity.nmg_channel_info;
import cn.leadeon.cardopenadmin.entity.nmg_city_info;
import cn.leadeon.cardopenadmin.entity.nmg_user_info;
import cn.leadeon.cardopenadmin.mapper.nmg_channel_infoMapper;
import cn.leadeon.cardopenadmin.mapper.nmg_city_infoMapper;
import cn.leadeon.cardopenadmin.mapper.nmg_county_infoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class nmg_channel_infoService {

    @Autowired
    private nmg_channel_infoMapper nmg_channel_infoMapper;

    @Autowired
    private nmg_city_infoMapper nmg_city_infoMapper;

    @Autowired
    private nmg_county_infoMapper nmg_county_infoMapper;

    public CardResponse channel (nmg_channel_info nmg_channel_info, HttpSession httpSession) {
        CardResponse cardResponse = new CardResponse();
        nmg_user_info nmg_user_info = (nmg_user_info) httpSession.getAttribute("userInfo");
        Map param = new HashMap();
        Map result = new HashMap();
        List results = new ArrayList();
        //如果是盟市管理员，则仅能查看当前负责盟市的渠道信息
        if (nmg_user_info.getUserRole().equals("2")) {
            param.put("city",nmg_user_info.getCityCode());
            param.put("channelType",nmg_channel_info.getChannelType());
            param.put("chargeTel",nmg_user_info.getUserTel());
            result.put("city",nmg_city_infoMapper.cityInfo(param));
            result.put("county",nmg_county_infoMapper.countyInfo(param));
        } else {
            if (null != nmg_channel_info.getCity() || !"".equals(nmg_channel_info.getCity())) {
                param.put("city",nmg_channel_info.getCity());
            }
            List<nmg_city_info> city = nmg_city_infoMapper.cityInfo(param);
            result.put("city",city);
            if (null == nmg_channel_info.getCity() || "".equals(nmg_channel_info.getCity())) {
                param.put("city",city.get(0).getCityCode());
            } else {
                param.put("city",nmg_channel_info.getCity());
            }
            result.put("county", nmg_county_infoMapper.countyInfo(param));
        }
        result.put("channel",nmg_channel_infoMapper.myChannelInfo(param));
        results.add(result);
        cardResponse.setResBody(results);
        return cardResponse;
    }

}
