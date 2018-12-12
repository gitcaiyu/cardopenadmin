package cn.leadeon.cardopenadmin.mapper;

import cn.leadeon.cardopenadmin.entity.nmg_county_info;

import java.util.List;
import java.util.Map;

public interface nmg_county_infoMapper {
    int insert(nmg_county_info record);

    int insertSelective(nmg_county_info record);

    List<Map<String,Object>> countyInfo(Map param);
}