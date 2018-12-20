package cn.leadeon.cardopenadmin.common;

import java.util.UUID;

public class RandomUtil {

    /**
     * 数据库主键
     */
    public String uuid = UUID.randomUUID().toString().replace("-","");

    /**
     * 订单编号：渠道号+当天年月日+4位自增数
     */
    public static String orderid (String channelId) {
        return channelId + DateUtil.YYYYMMDD() + UUID.randomUUID().toString().substring(0,4);
    }

}
