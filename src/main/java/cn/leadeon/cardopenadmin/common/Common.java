package cn.leadeon.cardopenadmin.common;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class Common {

    private String channelId;

    private String channelName;

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

}
