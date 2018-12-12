package cn.leadeon.cardopenadmin.common.resBody;

import cn.leadeon.cardopenadmin.common.CodeEnum;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class CardResponse {

    private String resCode;

    private List resBody;

    private String resDesc;

    //默认返回成功
    public CardResponse() {
        setResCode(CodeEnum.success.getCode());
        setResDesc(CodeEnum.success.getDesc());
        setResBody(new ArrayList());
    }

}
