package cn.leadeon.cardopenadmin.common;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class Common {

    private String channelId;

    private String channelName;

    private String stateId;

    private String stateName;

    public List<Common> channelType() {
        List<Common> list = new ArrayList<>();
        Common a = new Common();
        a.setChannelId("1");
        a.setChannelName("社会渠道");
        list.add(a);
        Common b = new Common();
        b.setChannelId("2");
        b.setChannelName("自营渠道");
        list.add(b);
        return list;
    }

    public List<Common> orderState() {
        List<Common> list = new ArrayList<>();
        Common a = new Common();
        a.setStateId("1");
        a.setStateName("待审批");
        list.add(a);
        Common b = new Common();
        b.setStateId("2");
        b.setStateName("已审批");
        list.add(b);
        Common c = new Common();
        c.setStateId("3");
        c.setStateName("已写卡");
        list.add(c);
        Common d = new Common();
        d.setStateId("4");
        d.setStateName("已邮寄");
        list.add(d);
        Common e = new Common();
        e.setStateId("5");
        e.setStateName("已取消");
        list.add(e);
        return list;
    }

}
