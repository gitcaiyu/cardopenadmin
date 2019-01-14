package cn.leadeon.cardopenadmin.mapper;

import cn.leadeon.cardopenadmin.entity.nmg_user_info;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

public interface nmg_user_infoMapper {
    int insert(nmg_user_info record);

    int insertSelective(nmg_user_info record);

    nmg_user_info getUserInfoByPhone(String phone);

    nmg_user_info userValid(Map param);

    List<Map<String,Object>> allUserInfo(Map param, RowBounds rowBounds);

    int userDel(String userId);

    int allUserTotal(Map param);
}