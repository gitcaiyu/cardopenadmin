package cn.leadeon.cardopenadmin.entity;

import cn.leadeon.cardopenadmin.common.reqBody.BaseEntity;
import lombok.Data;

@Data
public class nmg_channel_info extends BaseEntity {

    private String channelId;

    private String channelName;

    private String channelType;

    private String city;

    private String county;

    private String chargeName;

    private String chargeTel;

    private String channelAddress;

    private String channelCode;
}