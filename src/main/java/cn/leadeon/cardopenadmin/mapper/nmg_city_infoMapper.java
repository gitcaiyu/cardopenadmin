package cn.leadeon.cardopenadmin.mapper;

import cn.leadeon.cardopenadmin.entity.nmg_city_info;

import java.util.List;
import java.util.Map;

public interface nmg_city_infoMapper {
    int insert(nmg_city_info record);

    int insertSelective(nmg_city_info record);

    List<nmg_city_info> cityInfo(Map param);
}