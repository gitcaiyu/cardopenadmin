package cn.leadeon.cardopenadmin.common.reqBody;

import lombok.Data;

@Data
public class BaseEntity {

    private int curr;

    private int limit;

    private int totalCount;

}
