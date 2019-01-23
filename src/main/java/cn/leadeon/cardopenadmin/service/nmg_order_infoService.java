package cn.leadeon.cardopenadmin.service;

import cn.leadeon.cardopenadmin.common.*;
import cn.leadeon.cardopenadmin.common.resBody.CardResponse;
import cn.leadeon.cardopenadmin.entity.nmg_city_info;
import cn.leadeon.cardopenadmin.entity.nmg_order_detail;
import cn.leadeon.cardopenadmin.entity.nmg_order_info;
import cn.leadeon.cardopenadmin.entity.nmg_user_info;
import cn.leadeon.cardopenadmin.mapper.*;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.ibatis.session.RowBounds;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.ss.usermodel.Cell;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class nmg_order_infoService {

    @Autowired
    private nmg_order_infoMapper nmg_order_infoMapper;

    @Autowired
    private nmg_order_detailMapper nmg_order_detailMapper;

    @Autowired
    private nmg_city_infoMapper nmg_city_infoMapper;

    @Autowired
    private nmg_county_infoMapper nmg_county_infoMapper;

    @Autowired
    private nmg_meal_infoMapper nmg_meal_infoMapper;

    @Autowired
    private nmg_discount_infoMapper nmg_discount_infoMapper;

    @Autowired
    private nmg_city_infoService nmg_city_infoService;

    @Value("${file.path}")
    private String path;

    public JSONObject simCard(nmg_order_info nmg_order_info, HttpServletRequest httpServletRequest) {
        CardResponse cardResponse = new CardResponse();
        HttpSession httpSession = httpServletRequest.getSession();
        nmg_user_info nmg_user_info = (nmg_user_info) httpSession.getAttribute("userInfo");
        Map param = new HashMap();
        JSONObject result = new JSONObject();
        //如果是盟市管理员，则仅能操作当前盟市的SIM卡信息
        if (nmg_user_info.getUserRole().equals("2")) {
            param.put("city",nmg_user_info.getCityCode());
            result.put("city",nmg_city_infoMapper.cityInfo(param));
            result.put("county",nmg_county_infoMapper.countyInfo(param));
        } else {
            if (null != nmg_order_info.getCity() && !"".equals(nmg_order_info.getCity())) {
                param.put("city",nmg_order_info.getCity());
            }
            List<nmg_city_info> city = nmg_city_infoService.city();
            result.put("city",city);
            result.put("county", nmg_county_infoMapper.countyInfo(param));
            param.put("flag","T");
        }
        param.put("mealState","1");
        result.put("meal",nmg_meal_infoMapper.applyCardMeal(param));
        result.put("discount",nmg_discount_infoMapper.applyCardDisc(param));
        if (null != nmg_order_info.getOrderOtherPhone() && !"".equals(nmg_order_info.getOrderOtherPhone())) {
            param.put("phone",nmg_order_info.getOrderOtherPhone());
        }
        if (null != nmg_order_info.getOrderOtherPeople() && !"".equals(nmg_order_info.getOrderOtherPeople())) {
            param.put("people",nmg_order_info.getOrderOtherPeople());
        }
        if (null != nmg_order_info.getCounty() && !"".equals(nmg_order_info.getCounty())) {
            param.put("county",nmg_order_info.getCounty());
        }
        if (null != nmg_order_info.getOrderMeal() && !"".equals(nmg_order_info.getOrderMeal())) {
            param.put("meal",nmg_order_info.getOrderMeal());
        }
        if (null != nmg_order_info.getOrderDiscount() && !"".equals(nmg_order_info.getOrderDiscount())) {
            param.put("discount",nmg_order_info.getOrderDiscount());
        }
        if (null != nmg_order_info.getOrderTariff() && !"".equals(nmg_order_info.getOrderTariff())) {
            param.put("tariff",nmg_order_info.getOrderTariff());
        }
        if (null != nmg_order_info.getOrderState() && !"".equals(nmg_order_info.getOrderState())) {
            param.put("state",nmg_order_info.getOrderState());
        }
        if (null != nmg_order_info.getChannelName() && !"".equals(nmg_order_info.getChannelName())) {
            param.put("channelName",nmg_order_info.getChannelName());
        }
        if (null != nmg_order_info.getChannelName() && !"".equals(nmg_order_info.getChannelName())) {
            param.put("channelName",nmg_order_info.getChannelName());
        }
        if (null != nmg_order_info.getSubTime() && !"".equals(nmg_order_info.getSubTime())) {
            param.put("subtime",nmg_order_info.getSubTime());
            param.put("subtimeE",nmg_order_info.getSubTimeE());
        }
        if (null != nmg_order_info.getCreateTime() && !"".equals(nmg_order_info.getCreateTime())) {
            param.put("createtime",nmg_order_info.getCreateTime());
            param.put("createtimeE",nmg_order_info.getCreateTimeE());
        }
        //1：社会渠道，2：自营渠道
        if (null != nmg_order_info.getChannelType() && !"".equals(nmg_order_info.getChannelType())) {
            param.put("channelType",nmg_order_info.getChannelType());
        }
//        RowBounds rowBounds = new RowBounds((nmg_order_info.getCurr() - 1) * nmg_order_info.getLimit(),nmg_order_info.getLimit());
        List orderList = nmg_order_infoMapper.detail(param,new RowBounds());
//        result.put("order",orderList);
//        result.put("channelType",new Common().channelType());
//        result.put("orderState",new Common().orderState());
//        cardResponse.setResBody(result);
//        cardResponse.setTotalCount(nmg_order_infoMapper.totalCount(param));
        result.put("data",orderList);
        result.put("channelType",new Common().channelType());
        result.put("orderState",new Common().orderState());
        result.put("code",0);
        result.put("count",nmg_order_infoMapper.totalCount(param));
        return result;
    }

    public JSONObject workCount(nmg_order_info nmg_order_info) {
        Map param = new HashMap();
        JSONObject result = new JSONObject();
        //如果是盟市管理员，则仅能操作当前盟市的SIM卡信息
        if (null != nmg_order_info.getCity() && !"".equals(nmg_order_info.getCity())) {
            param.put("city",nmg_order_info.getCity());
        }
        List<nmg_city_info> city = nmg_city_infoMapper.cityInfo(param);
        result.put("city",city);
        result.put("county", nmg_county_infoMapper.countyInfo(param));
        param.put("flag","T");
        param.put("mealState","1");
        result.put("meal",nmg_meal_infoMapper.applyCardMeal(param));
        result.put("discount",nmg_discount_infoMapper.applyCardDisc(param));
        if (null != nmg_order_info.getOrderOtherPhone() && !"".equals(nmg_order_info.getOrderOtherPhone())) {
            param.put("phone",nmg_order_info.getOrderOtherPhone());
        }
        if (null != nmg_order_info.getOrderOtherPeople() && !"".equals(nmg_order_info.getOrderOtherPeople())) {
            param.put("people",nmg_order_info.getOrderOtherPeople());
        }
        if (null != nmg_order_info.getCounty() && !"".equals(nmg_order_info.getCounty())) {
            param.put("county",nmg_order_info.getCounty());
        }
        if (null != nmg_order_info.getOrderMeal() && !"".equals(nmg_order_info.getOrderMeal())) {
            param.put("meal",nmg_order_info.getOrderMeal());
        }
        if (null != nmg_order_info.getOrderDiscount() && !"".equals(nmg_order_info.getOrderDiscount())) {
            param.put("discount",nmg_order_info.getOrderDiscount());
        }
        if (null != nmg_order_info.getOrderTariff() && !"".equals(nmg_order_info.getOrderTariff())) {
            param.put("tariff",nmg_order_info.getOrderTariff());
        }
        if (null != nmg_order_info.getOrderState() && !"".equals(nmg_order_info.getOrderState())) {
            param.put("state",nmg_order_info.getOrderState());
        }
        if (null != nmg_order_info.getChannelName() && !"".equals(nmg_order_info.getChannelName())) {
            param.put("channelName",nmg_order_info.getChannelName());
        }
        if (null != nmg_order_info.getChannelName() && !"".equals(nmg_order_info.getChannelName())) {
            param.put("channelName",nmg_order_info.getChannelName());
        }
        if (null != nmg_order_info.getSubTime() && !"".equals(nmg_order_info.getSubTime())) {
            param.put("subtime",nmg_order_info.getSubTime());
            param.put("subtimeE",nmg_order_info.getSubTimeE());
        }
        if (null != nmg_order_info.getCreateTime() && !"".equals(nmg_order_info.getCreateTime())) {
            param.put("createtime",nmg_order_info.getCreateTime());
            param.put("createtimeE",nmg_order_info.getCreateTimeE());
        }
        //1：社会渠道，2：自营渠道
        if (null != nmg_order_info.getChannelType() && !"".equals(nmg_order_info.getChannelType())) {
            param.put("channelType",nmg_order_info.getChannelType());
        }
        RowBounds rowBounds = new RowBounds((nmg_order_info.getCurr() - 1) * nmg_order_info.getLimit(),nmg_order_info.getLimit());
        List orderList = nmg_order_infoMapper.detail(param,rowBounds);
        result.put("data",orderList);
        result.put("orderState",new Common().orderState());
        result.put("code",0);
        result.put("count",nmg_order_infoMapper.totalCount(param));
        return result;
    }

    public CardResponse orderExport(nmg_order_info nmg_order_info, HttpSession httpSession) {
        CardResponse cardResponse = new CardResponse();
        try {
            nmg_user_info nmg_user_info = (nmg_user_info) httpSession.getAttribute("userInfo");
            String fileName = path + nmg_user_info.getUserName() + "的工单信息" + DateUtil.getDateString() + ".xls";
            Map param = new HashMap();
            if (null != nmg_order_info.getCity() && !"".equals(nmg_order_info.getCity())) {
                param.put("city", nmg_order_info.getCity());
            }
            if (null != nmg_order_info.getOrderOtherPhone() && !"".equals(nmg_order_info.getOrderOtherPhone())) {
                param.put("phone",nmg_order_info.getOrderOtherPhone());
            }
            if (null != nmg_order_info.getOrderOtherPeople() && !"".equals(nmg_order_info.getOrderOtherPeople())) {
                param.put("people",nmg_order_info.getOrderOtherPeople());
            }
            if (null != nmg_order_info.getCounty() && !"".equals(nmg_order_info.getCounty())) {
                param.put("county",nmg_order_info.getCounty());
            }
            if (null != nmg_order_info.getOrderMeal() && !"".equals(nmg_order_info.getOrderMeal())) {
                param.put("meal",nmg_order_info.getOrderMeal());
            }
            if (null != nmg_order_info.getOrderDiscount() && !"".equals(nmg_order_info.getOrderDiscount())) {
                param.put("discount",nmg_order_info.getOrderDiscount());
            }
            if (null != nmg_order_info.getOrderTariff() && !"".equals(nmg_order_info.getOrderTariff())) {
                param.put("tariff",nmg_order_info.getOrderTariff());
            }
            if (null != nmg_order_info.getOrderState() && !"".equals(nmg_order_info.getOrderState())) {
                param.put("state",nmg_order_info.getOrderState());
            }
            if (null != nmg_order_info.getChannelName() && !"".equals(nmg_order_info.getChannelName())) {
                param.put("channelName",nmg_order_info.getChannelName());
            }
            if (null != nmg_order_info.getChannelName() && !"".equals(nmg_order_info.getChannelName())) {
                param.put("channelName",nmg_order_info.getChannelName());
            }
            if (null != nmg_order_info.getSubTime() && !"".equals(nmg_order_info.getSubTime())) {
                param.put("subtime",nmg_order_info.getSubTime());
                param.put("subtimeE",nmg_order_info.getSubTimeE());
            }
            if (null != nmg_order_info.getCreateTime() && !"".equals(nmg_order_info.getCreateTime())) {
                param.put("createtime",nmg_order_info.getCreateTime());
                param.put("createtimeE",nmg_order_info.getCreateTimeE());
            }
            //1：社会渠道，2：自营渠道
            if (null != nmg_order_info.getChannelType() && !"".equals(nmg_order_info.getChannelType())) {
                param.put("channelType",nmg_order_info.getChannelType());
            }
            List<Map<String,Object>> result = nmg_order_infoMapper.detail(param,new RowBounds());
            HSSFWorkbook hssfWorkbook = new HSSFWorkbook();
            HSSFSheet sheet= hssfWorkbook.createSheet("工单信息");
            HSSFRow row = sheet.createRow(0);
            HSSFCell cell = row.createCell(0);
            cell.setCellValue("申请时间");
            cell = row.createCell(1);
            cell.setCellValue("工单编号");
            cell = row.createCell(2);
            cell.setCellValue("盟市");
            cell = row.createCell(3);
            cell.setCellValue("县区");
            cell = row.createCell(4);
            cell.setCellValue("社渠编码");
            cell = row.createCell(5);
            cell.setCellValue("社渠名称");
            cell = row.createCell(6);
            cell.setCellValue("套餐");
            cell = row.createCell(7);
            cell.setCellValue("资费代码");
            cell = row.createCell(8);
            cell.setCellValue("优惠促销");
            cell = row.createCell(9);
            cell.setCellValue("数量");
            cell = row.createCell(10);
            cell.setCellValue("工单状态");
            cell = row.createCell(11);
            cell.setCellValue("写卡完成时间");
            cell = row.createCell(12);
            cell.setCellValue("收件人");
            cell = row.createCell(13);
            cell.setCellValue("收件人号码");
            for (int i = 0; i < result.size(); i++) {
                Map maps = result.get(i);
                row = sheet.createRow(i+1);
                if (maps.get("sub_time") != null) {
                    row.createCell(0).setCellValue((String) maps.get("sub_time"));
                }
                if (maps.get("order_id") != null) {
                    row.createCell(1).setCellValue((String) maps.get("order_id"));
                }
                if (maps.get("city_name") != null) {
                    row.createCell(2).setCellValue((String) maps.get("city_name"));
                }
                if (maps.get("county_name") != null) {
                    row.createCell(3).setCellValue((String) maps.get("county_name"));
                }
                if (maps.get("channel_id") != null) {
                    row.createCell(4).setCellValue((String) maps.get("channel_id"));
                }
                if (maps.get("channel_name") != null) {
                    row.createCell(5).setCellValue((String) maps.get("channel_name"));
                }
                if (maps.get("meal_name") != null) {
                    row.createCell(6).setCellValue((String) maps.get("meal_name"));
                }
                if (maps.get("meal_code") != null) {
                    row.createCell(7).setCellValue((String) maps.get("meal_code"));
                }
                if (maps.get("discount_name") != null) {
                    row.createCell(8).setCellValue((String) maps.get("discount_name"));
                }
                if (maps.get("order_count") != null) {
                    row.createCell(9).setCellValue((String) maps.get("order_count"));
                }
                if (maps.get("order_state") != null) {
                    row.createCell(10).setCellValue((String) maps.get("order_state"));
                }
                if (maps.get("create_time") != null) {
                    row.createCell(11).setCellValue((String) maps.get("create_time"));
                }
                if (maps.get("order_people") != null) {
                    row.createCell(12).setCellValue((String) maps.get("order_people"));
                }
                if (maps.get("order_phone") != null) {
                    row.createCell(13).setCellValue((String) maps.get("order_phone"));
                }
            }
            FileOutputStream fileOutputStream = new FileOutputStream(fileName);
            hssfWorkbook.write(fileOutputStream);
            fileOutputStream.close();
            hssfWorkbook.close();
            cardResponse.setResDesc(fileName);
        } catch (Exception e) {
            cardResponse.setResCode(CodeEnum.failed.getCode());
            cardResponse.setResDesc(CodeEnum.failed.getDesc());
        }
        return cardResponse;
    }

    @Transactional
    public CardResponse orderDel(nmg_order_info nmg_order_info) {
        CardResponse cardResponse = new CardResponse();
        nmg_order_infoMapper.orderDel(nmg_order_info.getOrderId());
        return cardResponse;
    }

    /**
     * 订单状态->待审批：1，已审批:2，已写卡:3，已邮寄:4，已取消：5
     * @param data
     * @return
     */
    @Transactional
    public CardResponse updateState(String data) {
        CardResponse cardResponse = new CardResponse();
        Object jsonObject = JSON.parse(data);
        JSONObject object = (JSONObject) jsonObject;
        Map param = new HashMap();
        param.put("orderState",object.getString("orderState"));
        param.put("orderId",object.getString("orderId"));
        nmg_order_infoMapper.orderStateUpdate(param);
        return cardResponse;
    }

    /**
     * 如果状态为已写卡则展示订单详细信息，用页面选择的工单号码去工单明细表查询
     * @param data
     * @return
     */
    public CardResponse orderDetail(String data,HttpServletRequest httpServletRequest) {
        HttpSession httpSession = httpServletRequest.getSession();
        nmg_user_info nmg_user_info = (nmg_user_info) httpSession.getAttribute("userInfo");
        String city = nmg_user_info.getCityCode();
        CardResponse cardResponse = new CardResponse();
        JSONObject jsonObject = JSONObject.parseObject(data);
        Map param = new HashMap();
        if (!"".equals(jsonObject.getString("cardnum"))) {
            param.put("cardnum",jsonObject.getString("cardnum"));
        }
        if (!"".equals(jsonObject.getString("simnum"))) {
            param.put("simnum",jsonObject.getString("simnum"));
        }
        if (!"".equals(jsonObject.getString("orderMeal"))) {
            param.put("orderMeal",jsonObject.getString("orderMeal"));
        }
        if (!"".equals(jsonObject.getString("orderTariff"))) {
            param.put("orderTariff",jsonObject.getString("orderTariff"));
        }
        if (!"".equals(jsonObject.getString("orderState"))) {
            param.put("orderState",jsonObject.getString("orderState"));
        }
        if (!"".equals(jsonObject.getString("orderDiscount"))) {
            param.put("orderDiscount",jsonObject.getString("orderDiscount"));
        }
        if (!"".equals(jsonObject.get("orderId"))) {
            param.put("orderId",jsonObject.get("orderId"));
        }
        int curr = jsonObject.getInteger("curr");
        int limit = jsonObject.getInteger("limit");
        RowBounds rowBounds = new RowBounds((curr - 1) * limit,limit);
        List<Map<String,Object>> details = nmg_order_infoMapper.exportOrder(param,rowBounds);
        Map result = new HashMap();
        if (nmg_user_info.getUserRole().equals("2")) {
            param.put("city", city);
        } else {
            param.put("flag", "T");
        }
        result.put("detail",details);
        param.put("mealState","1");
        result.put("meal",nmg_meal_infoMapper.applyCardMeal(param));
        result.put("discount",nmg_discount_infoMapper.applyCardDisc(param));
        cardResponse.setResBody(result);
        cardResponse.setTotalCount(nmg_order_infoMapper.detailTotalCount(param));
        return cardResponse;
    }

    public JSONObject simCount(String data) {
        JSONObject jsonObject = JSONObject.parseObject(data);
        Map param = new HashMap();
        if (!"".equals(jsonObject.getString("cardnum"))) {
            param.put("cardnum",jsonObject.getString("cardnum"));
        }
        if (!"".equals(jsonObject.getString("simnum"))) {
            param.put("simnum",jsonObject.getString("simnum"));
        }
        if (!"".equals(jsonObject.getString("orderMeal"))) {
            param.put("orderMeal",jsonObject.getString("orderMeal"));
        }
        if (!"".equals(jsonObject.getString("orderTariff"))) {
            param.put("orderTariff",jsonObject.getString("orderTariff"));
        }
        if (!"".equals(jsonObject.getString("orderState"))) {
            param.put("orderState",jsonObject.getString("orderState"));
        }
        if (!"".equals(jsonObject.getString("orderDiscount"))) {
            param.put("orderDiscount",jsonObject.getString("orderDiscount"));
        }
        if (!"".equals(jsonObject.get("orderId"))) {
            param.put("orderId",jsonObject.get("orderId"));
        }
        if (!"".equals(jsonObject.get("subtime"))) {
            param.put("subtime",jsonObject.get("subtime"));
            param.put("subtimeE",jsonObject.get("subtimeE"));
        }
        if (!"".equals(jsonObject.get("createtime"))) {
            param.put("createtime",jsonObject.get("createtime"));
            param.put("createtimeE",jsonObject.get("createtimeE"));
        }
        int curr = jsonObject.getInteger("curr");
        int limit = jsonObject.getInteger("limit");
        RowBounds rowBounds = new RowBounds((curr - 1) * limit,limit);
        List<Map<String,Object>> details = nmg_order_infoMapper.exportOrder(param,rowBounds);
        JSONObject result = new JSONObject();
        param.put("flag", "T");
        param.put("mealState","1");
        result.put("meal",nmg_meal_infoMapper.applyCardMeal(param));
        result.put("discount",nmg_discount_infoMapper.applyCardDisc(param));
        result.put("data",details);
        result.put("state",new Common().orderState());
        result.put("code",0);
        result.put("count",nmg_order_infoMapper.detailTotalCount(param));
        return result;
    }

    /**
     *工单明细导出
     * @param data
     * @return
     */
    public CardResponse orderDetailExport(String data,HttpServletRequest httpServletRequest) {
        HttpSession httpSession = httpServletRequest.getSession();
        nmg_user_info nmg_user_info = (nmg_user_info) httpSession.getAttribute("userInfo");
        CardResponse cardResponse = new CardResponse();
        String fileName = path + nmg_user_info.getUserName()+"的SIM卡回录信息"+DateUtil.getDateString()+".xls";;
        Map param = new HashMap();
        try {
            JSONObject jsonObject = JSONObject.parseObject(data);
            HSSFWorkbook hssfWorkbook = new HSSFWorkbook();
            HSSFSheet sheet= hssfWorkbook.createSheet("工单信息");
            sheet.setColumnHidden(6,true);
            HSSFRow row = sheet.createRow(0);
            HSSFCell cell = row.createCell(0);
            cell.setCellValue("工单编号");
            cell = row.createCell(1);
            cell.setCellValue("套餐资费");
            cell = row.createCell(2);
            cell.setCellValue("资费代码");
            cell = row.createCell(3);
            cell.setCellValue("优惠促销");
            cell = row.createCell(4);
            cell.setCellValue("选购号码");
            cell = row.createCell(5);
            cell.setCellValue("SIM卡号");
            if (!"".equals(jsonObject.getString("cardnum"))) {
                param.put("cardnum",jsonObject.getString("cardnum"));
            }
            if (!"".equals(jsonObject.getString("simnum"))) {
                param.put("simnum",jsonObject.getString("simnum"));
            }
            if (!"".equals(jsonObject.getString("orderMeal"))) {
                param.put("orderMeal",jsonObject.getString("orderMeal"));
            }
            if (!"".equals(jsonObject.getString("orderTariff"))) {
                param.put("orderTariff",jsonObject.getString("orderTariff"));
            }
            if (!"".equals(jsonObject.getString("orderState"))) {
                param.put("orderState",jsonObject.getString("orderState"));
            }
            if (!"".equals(jsonObject.getString("orderDiscount"))) {
                param.put("orderDiscount",jsonObject.getString("orderDiscount"));
            }
            if (!"".equals(jsonObject.get("orderId"))) {
                param.put("orderId",jsonObject.get("orderId"));
            }
            if (!"".equals(jsonObject.get("subtime"))) {
                param.put("subtime",jsonObject.get("subtime"));
                param.put("subtimeE",jsonObject.get("subtimeE"));
            }
            if (!"".equals(jsonObject.get("createtime"))) {
                param.put("createtime",jsonObject.get("createtime"));
                param.put("createtimeE",jsonObject.get("createtimeE"));
            }
            List<Map<String,Object>> result = nmg_order_infoMapper.exportOrder(param,new RowBounds());
            for (int i = 0; i < result.size(); i++) {
                Map maps = result.get(i);
                row = sheet.createRow(i+1);
                if (maps.get("order_id") != null) {
                    row.createCell(0).setCellValue((String) maps.get("order_id"));
                }
                if (maps.get("meal_name") != null) {
                    row.createCell(1).setCellValue((String) maps.get("meal_name"));
                }
                if (maps.get("meal_code") != null) {
                    row.createCell(2).setCellValue((String) maps.get("meal_code"));
                }
                if (maps.get("discount_name") != null) {
                    row.createCell(3).setCellValue((String) maps.get("discount_name"));
                }
                if (maps.get("cardNum") != null) {
                    row.createCell(4).setCellValue((String) maps.get("cardNum"));
                }
                if (maps.get("SIMNum") != null) {
                    row.createCell(5).setCellValue((String) maps.get("SIMNum"));
                }
                if (maps.get("order_discount") != null) {
                    row.createCell(6).setCellValue((String) maps.get("order_discount"));
                }
            }
            FileOutputStream fileOutputStream = new FileOutputStream(fileName);
            hssfWorkbook.write(fileOutputStream);
            fileOutputStream.close();
            hssfWorkbook.close();
            cardResponse.setResDesc(fileName);
        } catch (Exception e) {
            cardResponse.setResCode(CodeEnum.failed.getCode());
            cardResponse.setResDesc(CodeEnum.failed.getDesc());
        }
        return cardResponse;
    }

    /**
     * 工单详细信息删除
     * @param data
     * @return
     */
    @Transactional
    public CardResponse orderDetailDel(String data) {
        CardResponse cardResponse = new CardResponse();
        Object jsonObject = JSON.parse(data);
        JSONObject array = (JSONObject) jsonObject;
        JSONArray jsonArray = array.getJSONArray("detail");
        for (int i = 0; i < jsonArray.size(); i++) {
            nmg_order_infoMapper.orderDetailDel(jsonArray.getString(i));
        }
        return cardResponse;
    }

    @Transactional
    public CardResponse orderDetailAdd(String data) {
        CardResponse cardResponse = new CardResponse();
        Object jsonObject = JSON.parse(data);
        JSONObject object = (JSONObject) jsonObject;
        nmg_order_detail nmg_order_detail = new nmg_order_detail();
        if (null==object.get("detailId") || object.get("detailId").equals("")) {
            nmg_order_detail.setDetailId(new RandomUtil().uuid);
            nmg_order_detail.setOrderId(object.getString("orderId"));
            nmg_order_detail.setCardnum(object.getString("cardnum"));
            nmg_order_detail.setSimnum(object.getString("simnum"));
            nmg_order_detail.setOrderMeal(object.getString("mealId"));
            nmg_order_detail.setOrderDiscount(object.getString("discount"));
            nmg_order_detailMapper.insert(nmg_order_detail);
        } else {

        }
        return cardResponse;
    }

    @Transactional
    public CardResponse detailBatchImport(MultipartFile file) throws IOException {
        CardResponse cardResponse = new CardResponse();
        InputStream inputStream = file.getInputStream();
        HSSFWorkbook xssfWorkbook = new HSSFWorkbook(inputStream);
        int numberOfSheets = xssfWorkbook.getNumberOfSheets();
        for (int i = 0; i < numberOfSheets; i++) {
            HSSFSheet sheetAt = xssfWorkbook.getSheetAt(i);
            int lastRowNum = sheetAt.getLastRowNum();
            for (int j = 1; j <= lastRowNum; j++) {
                nmg_order_detail nmg_order_detail = new nmg_order_detail();
                Map param = new HashMap();
                HSSFRow row = sheetAt.getRow(j);
                nmg_order_detail.setDetailId(new RandomUtil().uuid);
                row.getCell(0).setCellType(Cell.CELL_TYPE_STRING);
                nmg_order_detail.setOrderId(row.getCell(0).getStringCellValue());
                nmg_order_detail.setOrderTariff(row.getCell(1).getStringCellValue());
                nmg_order_detail.setOrderMeal(row.getCell(2).getStringCellValue());
                param.put("discountName",row.getCell(3).getStringCellValue());
                param.put("flag","T");
                List<Map<String,String>> discount = nmg_discount_infoMapper.applyCardDisc(param);
                nmg_order_detail.setOrderDiscount(discount.get(0).get("discount_id"));
                row.getCell(4).setCellType(Cell.CELL_TYPE_STRING);
                nmg_order_detail.setCardnum(row.getCell(4).getStringCellValue());
                row.getCell(5).setCellType(Cell.CELL_TYPE_STRING);
                nmg_order_detail.setSimnum(row.getCell(5).getStringCellValue());
                nmg_order_detailMapper.insert(nmg_order_detail);
            }
        }
        return cardResponse;
    }

    public CardResponse orderTemplate(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws IOException {
        CardResponse cardResponse = new CardResponse();
        HttpSession httpSession = httpServletRequest.getSession();
        nmg_user_info nmg_user_info = (nmg_user_info) httpSession.getAttribute("userInfo");
        Map param = new HashMap();
        String fileName = "SIM卡回录模板.xls";
        if (nmg_user_info.getUserRole().equals("2")) {
            param.put("city",nmg_user_info.getCityCode());
        } else {
            param.put("flag","T");
        }
        HSSFWorkbook hssfWorkbook = new HSSFWorkbook();
        HSSFSheet sheet= hssfWorkbook.createSheet("渠道信息");
        HSSFCellStyle textStyle = hssfWorkbook.createCellStyle();
        HSSFDataFormat format = hssfWorkbook.createDataFormat();
        textStyle.setDataFormat(format.getFormat("@"));
        HSSFRow row = sheet.createRow(0);
        HSSFCell cell = row.createCell(0);
        cell.setCellValue("工单编号");
        cell = row.createCell(1);
        cell.setCellValue("套餐资费");
        cell = row.createCell(2);
        cell.setCellValue("资费代码");
        cell = row.createCell(3);
        cell.setCellValue("优惠促销");
        cell = row.createCell(4);
        cell.setCellValue("选购号码");
        cell = row.createCell(5);
        cell.setCellValue("SIM卡号");
        cell.setCellStyle(textStyle);
        cell.setCellType(HSSFCell.CELL_TYPE_STRING);
        List<Map<String,String>> meal = nmg_meal_infoMapper.applyCardMeal(param);
        String[] mealId = new String[meal.size()];
        for (int i = 0; i < meal.size(); i++) {
            mealId[i] = meal.get(i).get("meal_code");
        }
        String[] mealName = new String[meal.size()];
        for (int i = 0; i < meal.size(); i++) {
            mealName[i] = meal.get(i).get("meal_name");
        }
        List<Map<String,String>> discount = nmg_discount_infoMapper.applyCardDisc(param);
        String[] discountArr = new String[discount.size()];
        for (int i = 0; i < discount.size(); i++) {
            Map map = discount.get(i);
            discountArr[i] = map.get("discount_name").toString();
        }
        sheet.addValidationData(POIUtil.createDataValidation(sheet, mealName, 1));
        sheet.addValidationData(POIUtil.createDataValidation(sheet, mealId, 2));
        sheet.addValidationData(POIUtil.createDataValidation(sheet, discountArr, 3));
        httpServletRequest.setCharacterEncoding("UTF-8");
        httpServletRequest.setCharacterEncoding("UTF-8");
        httpServletResponse.setContentType("application/x-download");
        fileName = new String(fileName.getBytes("gb2312"), "ISO8859-1");
        httpServletResponse.setHeader("Content-Disposition", "attachment;filename="+ fileName);
        OutputStream outputStream = httpServletResponse.getOutputStream();
        hssfWorkbook.write(outputStream);
        hssfWorkbook.close();
        cardResponse.setResDesc(fileName);
        return cardResponse;
    }
}
