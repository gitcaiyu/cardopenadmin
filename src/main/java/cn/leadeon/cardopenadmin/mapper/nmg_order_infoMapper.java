package cn.leadeon.cardopenadmin.mapper;

import cn.leadeon.cardopenadmin.entity.nmg_order_info;

import java.util.List;
import java.util.Map;

public interface nmg_order_infoMapper {
    int insert(nmg_order_info record);

    int insertSelective(nmg_order_info record);

    List<Map<String,Object>> detail(Map map);

    int updateOrderInfo(nmg_order_info record);

    int orderInfoDel(String batchId);

    int orderStateUpdate(Map param);

    List<Map<String,Object>> exportOrder(Map map);

    int orderDel(String orderId);

    int orderDetailDel(String detailId);
}