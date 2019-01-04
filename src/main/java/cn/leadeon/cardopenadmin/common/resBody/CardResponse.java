package cn.leadeon.cardopenadmin.common.resBody;

import cn.leadeon.cardopenadmin.common.CodeEnum;
import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class CardResponse {

    private String resCode;

    private Map resBody;

    private String resDesc;

    private int curr;

    private int limit;

    private int totalCount;

    //默认返回成功
    public CardResponse() {
        setResCode(CodeEnum.success.getCode());
        setResDesc(CodeEnum.success.getDesc());
        setResBody(new HashMap());
    }

}
