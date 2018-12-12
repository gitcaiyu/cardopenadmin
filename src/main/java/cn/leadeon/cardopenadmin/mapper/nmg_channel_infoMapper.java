package cn.leadeon.cardopenadmin.mapper;

import cn.leadeon.cardopenadmin.entity.nmg_channel_info;

import java.util.List;
import java.util.Map;

public interface nmg_channel_infoMapper {
    int insert(nmg_channel_info record);

    int insertSelective(nmg_channel_info record);

    List<Map<String,Object>> myChannelInfo(Map param);

    int channelUpdate(nmg_channel_info nmg_channel_info);

    int channelDel(String channelId);
}