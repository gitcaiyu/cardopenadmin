package cn.leadeon.cardopenadmin.mapper;

import cn.leadeon.cardopenadmin.entity.nmg_user_info;

public interface nmg_user_infoMapper {
    int insert(nmg_user_info record);

    int insertSelective(nmg_user_info record);

    nmg_user_info getUserInfoByPhone(String phone);
}