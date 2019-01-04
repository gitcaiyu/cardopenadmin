package cn.leadeon.cardopenadmin.entity;

import cn.leadeon.cardopenadmin.common.reqBody.BaseEntity;
import lombok.Data;

@Data
public class nmg_section_list extends BaseEntity {
    private String section;

    private String cityCode;

    private Long id;
}