package cn.leadeon.cardopenadmin.mapper;

import cn.leadeon.cardopenadmin.entity.nmg_section_list;

public interface nmg_section_listMapper {
    int insert(nmg_section_list record);

    int insertSelective(nmg_section_list record);

    String isValid(String phone);
}