package cn.leadeon.cardopenadmin.mapper;

import cn.leadeon.cardopenadmin.entity.nmg_discount_info;

import java.util.List;
import java.util.Map;

public interface nmg_discount_infoMapper {
    int insert(nmg_discount_info record);

    int insertSelective(nmg_discount_info record);

    /**
     * 获取所有优惠列表
     * @return
     */
    List<Map<String,String>> applyCardDisc(Map param);
}