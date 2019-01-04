package cn.leadeon.cardopenadmin.service;

import cn.leadeon.cardopenadmin.common.CodeEnum;
import cn.leadeon.cardopenadmin.common.DateUtil;
import cn.leadeon.cardopenadmin.common.RandomUtil;
import cn.leadeon.cardopenadmin.common.resBody.CardResponse;
import cn.leadeon.cardopenadmin.entity.nmg_city_info;
import cn.leadeon.cardopenadmin.entity.nmg_order_detail;
import cn.leadeon.cardopenadmin.entity.nmg_order_info;
import cn.leadeon.cardopenadmin.entity.nmg_user_info;
import cn.leadeon.cardopenadmin.mapper.*;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpSession;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
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

    @Value("${file.path}")
    private String path;

    public CardResponse simCard(nmg_order_info nmg_order_info, HttpSession httpSession) {
        CardResponse cardResponse = new CardResponse();
        nmg_user_info nmg_user_info = (nmg_user_info) httpSession.getAttribute("userInfo");
        Map param = new HashMap();
        Map result = new HashMap();
        //如果是盟市管理员，则仅能操作当前盟市的SIM卡信息
        if (nmg_user_info.getUserRole().equals("2")) {
            param.put("city",nmg_user_info.getCityCode());
            result.put("city",nmg_city_infoMapper.cityInfo(param));
            result.put("county",nmg_county_infoMapper.countyInfo(param));
        } else {
            if (null != nmg_order_info.getCity() && !"".equals(nmg_order_info.getCity())) {
                param.put("city",nmg_order_info.getCity());
            }
            List<nmg_city_info> city = nmg_city_infoMapper.cityInfo(param);
            result.put("city",city);
            result.put("county", nmg_county_infoMapper.countyInfo(param));
        }
        param.put("flag","T");
        result.put("meal",nmg_meal_infoMapper.applyCardMeal(param));
        result.put("discount",nmg_discount_infoMapper.applyCardDisc(param));
        if (null != nmg_order_info.getOrderPhone() && !"".equals(nmg_order_info.getOrderPhone())) {
            param.put("phone",nmg_order_info.getOrderPhone());
        }
        if (null != nmg_order_info.getOrderPeople() && !"".equals(nmg_order_info.getOrderPeople())) {
            param.put("people",nmg_order_info.getOrderPeople());
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
        result.put("order",nmg_order_infoMapper.detail(param));
        cardResponse.setResBody(result);
        return cardResponse;
    }

    public CardResponse orderExport(HttpSession httpSession) {
        CardResponse cardResponse = new CardResponse();
        try {
            nmg_user_info nmg_user_info = (nmg_user_info) httpSession.getAttribute("userInfo");
            String city = nmg_user_info.getCityCode();
            String fileName = path;
            Map param = new HashMap();
            param.put("city",city);
            List<Map<String,Object>> result = nmg_order_infoMapper.detail(param);
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
                if (i == 0) {
                    fileName = fileName + nmg_user_info.getUserName() + DateUtil.getDateString() + "的工单信息.xls";
                }
                if (maps.get("sub_time") != null) {
                    row.createCell(0).setCellValue((String) maps.get("sub_time"));
                }
                if (maps.get("order_id") != null) {
                    row.createCell(1).setCellValue((String) maps.get("order_id"));
                }
                if (maps.get("city") != null) {
                    param.put("city",maps.get("city"));
                    row.createCell(2).setCellValue(nmg_city_infoMapper.cityInfo(param).get(0).getCityName());
                }
                if (maps.get("county") != null) {
                    param = new HashMap();
                    param.put("county",maps.get("county"));
                    Map county = nmg_county_infoMapper.countyInfo(param).get(0);
                    row.createCell(3).setCellValue((String) county.get("county_name"));
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
     * @param nmg_order_info
     * @return
     */
    @Transactional
    public CardResponse orderPrint(nmg_order_info nmg_order_info) {
        CardResponse cardResponse = new CardResponse();
        Map param = new HashMap();
        param.put("orderState","3");
        param.put("orderId",nmg_order_info.getOrderId());
        nmg_order_infoMapper.orderStateUpdate(param);
        return cardResponse;
    }

    /**
     * 如果状态为已写卡则展示订单详细信息，用页面选择的工单号码去工单明细表查询
     * @param data
     * @return
     */
    public CardResponse orderDetail(String data,HttpSession httpSession) {
        nmg_user_info nmg_user_info = (nmg_user_info) httpSession.getAttribute("userInfo");
        String city = nmg_user_info.getCityCode();
        CardResponse cardResponse = new CardResponse();
        JSONObject jsonObject = JSONObject.parseObject(data);
        Map param = new HashMap();
        if (null != jsonObject.getString("cardnum")) {
            param.put("cardnum",jsonObject.getString("cardnum"));
        }
        if (null != jsonObject.getString("simnum")) {
            param.put("simnum",jsonObject.getString("simnum"));
        }
        if (null != jsonObject.getString("orderMeal")) {
            param.put("orderMeal",jsonObject.getString("orderMeal"));
        }
        if (null != jsonObject.getString("orderTariff")) {
            param.put("orderTariff",jsonObject.getString("orderTariff"));
        }
        if (null != jsonObject.getString("orderDiscount")) {
            param.put("orderDiscount",jsonObject.getString("orderDiscount"));
        }
        if (null != jsonObject.get("orderState") && jsonObject.get("orderState").equals("3")) {
            param.put("orderId",jsonObject.get("orderId"));
        }
        List<Map<String,Object>> details = nmg_order_infoMapper.exportOrder(param);
        Map result = new HashMap();
        param.put("city",city);
        param.put("flag","T");
        result.put("meal",nmg_meal_infoMapper.applyCardMeal(param));
        result.put("discount",nmg_discount_infoMapper.applyCardDisc(param));
        cardResponse.setResBody(result);
        return cardResponse;
    }

    /**
     *工单明细导出
     * @param nmg_order_info
     * @return
     */
    public CardResponse orderDetailExport(nmg_order_info nmg_order_info) {
        CardResponse cardResponse = new CardResponse();
        String fileName = path;
        Map param = new HashMap();
        try {
            HSSFWorkbook hssfWorkbook = new HSSFWorkbook();
            HSSFSheet sheet= hssfWorkbook.createSheet("工单信息");
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
            param.put("orderId",nmg_order_info.getOrderId());
            List<Map<String,Object>> result = nmg_order_infoMapper.exportOrder(param);
            for (int i = 0; i < result.size(); i++) {
                Map maps = result.get(i);
                row = sheet.createRow(i+1);
                if (maps.get("order_id") != null) {
                    row.createCell(0).setCellValue((String) maps.get("order_id"));
                    if (i == 0) {
                        fileName = fileName + maps.get("order_id").toString()+"SIM卡回录.xls";
                    }
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
        JSONArray jsonArray = JSONArray.parseArray(data);
        for (int i = 0; i < jsonArray.size(); i++) {
            String detailId = JSONObject.parseObject(jsonArray.getString(i)).getString("detailId");
            nmg_order_infoMapper.orderDetailDel(detailId);
        }
        return cardResponse;
    }

    @Transactional
    public CardResponse orderDetailAdd(nmg_order_detail nmg_order_detail) {
        CardResponse cardResponse = new CardResponse();
        nmg_order_detail.setDetailId(new RandomUtil().uuid);
        nmg_order_detailMapper.insert(nmg_order_detail);
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
                HSSFRow row = sheetAt.getRow(j);
                nmg_order_detail.setDetailId(new RandomUtil().uuid);
                nmg_order_detail.setOrderId(row.getCell(0).getStringCellValue());
                nmg_order_detail.setOrderMeal(row.getCell(1).getStringCellValue());
                nmg_order_detail.setOrderTariff(row.getCell(2).getStringCellValue());
                nmg_order_detail.setOrderDiscount(row.getCell(3).getStringCellValue());
                nmg_order_detail.setCardnum(row.getCell(4).getStringCellValue());
                nmg_order_detail.setSimnum(row.getCell(5).getStringCellValue());
                nmg_order_detailMapper.insert(nmg_order_detail);
            }
        }
        return cardResponse;
    }
}
