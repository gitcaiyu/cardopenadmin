package cn.leadeon.cardopenadmin.mapper;

import cn.leadeon.cardopenadmin.entity.nmg_user_role;

import java.util.List;
import java.util.Map;

public interface nmg_user_roleMapper {
    int insert(nmg_user_role record);

    int insertSelective(nmg_user_role record);

    List<Map<String,Object>> userRole(Map param);

    int roleDel(String roleId);

    int roleUpdate(nmg_user_role nmg_user_role);
}