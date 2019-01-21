package cn.leadeon.cardopenadmin.mapper;

import cn.leadeon.cardopenadmin.entity.nmg_order_info;
import org.apache.ibatis.annotations.Update;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

public interface nmg_order_infoMapper {
    int insert(nmg_order_info record);

    int insertSelective(nmg_order_info record);

    List<Map<String,Object>> detail(Map map, RowBounds rowBound);

    int updateOrderInfo(nmg_order_info record);

    int orderInfoDel(String batchId);

    int orderStateUpdate(Map param);

    List<Map<String,Object>> exportOrder(Map map,RowBounds rowBounds);

    int orderDel(String orderId);

    int orderDetailDel(String detailId);

    int totalCount(Map param);

    int detailTotalCount(Map param);

    /**
     * 定时取消48小时未审批的工单
     */
    @Update("update nmg_order_info set order_state = '5' where order_id in (select order_id from (select order_id from nmg_order_info where TIMESTAMPDIFF(HOUR,sub_time,now()) >= '48' and order_state = '1') as de)")
    void updateState();
}