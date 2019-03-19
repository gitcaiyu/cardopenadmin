package cn.leadeon.cardopenadmin.common.resBody;

import cn.leadeon.cardopenadmin.common.CodeEnum;
import lombok.Data;

import java.util.HashMap;
import java.util.Map;

public class CardResponse {

    public String getResCode() {
        return resCode;
    }

    public void setResCode(String resCode) {
        this.resCode = resCode;
    }

    public Map getResBody() {
        return resBody;
    }

    public void setResBody(Map resBody) {
        this.resBody = resBody;
    }

    public String getResDesc() {
        return resDesc;
    }

    public void setResDesc(String resDesc) {
        this.resDesc = resDesc;
    }

    public int getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }

    private String resCode;

    private Map resBody;

    private String resDesc;

    private int totalCount;

    //默认返回成功
    public CardResponse() {
        setResCode(CodeEnum.success.getCode());
        setResDesc(CodeEnum.success.getDesc());
        setResBody(new HashMap());
    }

}
