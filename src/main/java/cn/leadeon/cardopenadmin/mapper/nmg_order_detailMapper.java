package cn.leadeon.cardopenadmin.mapper;

import cn.leadeon.cardopenadmin.entity.nmg_order_detail;

public interface nmg_order_detailMapper {
    int insert(nmg_order_detail record);

    int insertSelective(nmg_order_detail record);

    int updateDetail(nmg_order_detail nmg_order_detail);
}