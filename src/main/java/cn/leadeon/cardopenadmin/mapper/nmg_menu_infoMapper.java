package cn.leadeon.cardopenadmin.mapper;

import cn.leadeon.cardopenadmin.entity.nmg_menu_info;

import java.util.List;
import java.util.Map;

public interface nmg_menu_infoMapper {
    int insert(nmg_menu_info record);

    int insertSelective(nmg_menu_info record);

    List<Map<String,Object>> menuList(Map param);
}