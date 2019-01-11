package cn.leadeon.cardopenadmin.service;

import cn.leadeon.cardopenadmin.common.CodeEnum;
import cn.leadeon.cardopenadmin.common.DateUtil;
import cn.leadeon.cardopenadmin.common.RandomUtil;
import cn.leadeon.cardopenadmin.common.resBody.CardResponse;
import cn.leadeon.cardopenadmin.entity.nmg_user_info;
import cn.leadeon.cardopenadmin.entity.nmg_user_role;
import cn.leadeon.cardopenadmin.mapper.nmg_city_infoMapper;
import cn.leadeon.cardopenadmin.mapper.nmg_user_infoMapper;
import cn.leadeon.cardopenadmin.mapper.nmg_user_roleMapper;
import com.alibaba.fastjson.JSONObject;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class nmg_user_infoService {

    @Autowired
    private nmg_menu_infoService nmg_menu_infoService;

    @Autowired
    private nmg_user_infoMapper nmg_user_infoMapper;

    @Autowired
    private nmg_user_roleMapper nmg_user_roleMapper;

    @Autowired
    private nmg_city_infoMapper nmg_city_infoMapper;

    @Value("${file.path}")
    private String path;

    public CardResponse userLogin(nmg_user_info nmg_user_info, HttpServletRequest httpServletRequest) {
        CardResponse cardResponse = new CardResponse();
        Map param = new HashMap();
        param.put("userTel",nmg_user_info.getUserTel());
        param.put("userPass",nmg_user_info.getUserPass());
        nmg_user_info userInfo = nmg_user_infoMapper.userValid(param);
        try {
            cardResponse = nmg_menu_infoService.menuList(userInfo.getUserRole());
            HttpSession httpSession = httpServletRequest.getSession();
            httpSession.setAttribute("userInfo",userInfo);
        } catch (Exception e) {
            cardResponse.setResCode(CodeEnum.loginFaild.getCode());
            cardResponse.setResDesc(CodeEnum.loginFaild.getDesc());
        }
        return cardResponse;
    }

    public CardResponse menu(HttpServletRequest httpServletRequest) {
        HttpSession httpSession = httpServletRequest.getSession();
        nmg_user_info userInfo = (nmg_user_info) httpSession.getAttribute("userInfo");
        CardResponse cardResponse = nmg_menu_infoService.menuList(userInfo.getUserRole());
        return cardResponse;
    }

    public CardResponse userManage(String data) {
        CardResponse cardResponse = new CardResponse();
        if (data != null) {
            try {
                JSONObject jsonObject = JSONObject.parseObject(data);
                Map param = new HashMap();
                if (null != jsonObject.get("userName")) {
                    param.put("userName",jsonObject.get("userName"));
                }
                if (null != jsonObject.get("userTel")) {
                    param.put("userTel",jsonObject.get("userTel"));
                }
                if (null != jsonObject.get("userType")) {
                    param.put("userType",jsonObject.get("userType"));
                }
                List<Map<String,Object>> allUserInfo = nmg_user_infoMapper.allUserInfo(param);
                Map result = new HashMap();
                result.put("user",allUserInfo);
                cardResponse.setResBody(result);
            } catch (Exception e) {
                cardResponse.setResDesc(e.getMessage());
                cardResponse.setResCode(CodeEnum.failed.getCode());
            }
        } else {
            cardResponse.setResCode(CodeEnum.nullValue.getCode());
            cardResponse.setResDesc(CodeEnum.nullValue.getDesc());
        }
        return cardResponse;
    }

    @Transactional
    public CardResponse userAdd(nmg_user_info nmg_user_info) {
        CardResponse cardResponse = new CardResponse();
        nmg_user_info.setUserId(new RandomUtil().uuid);
        nmg_user_infoMapper.insert(nmg_user_info);
        return cardResponse;
    }

    @Transactional
    public CardResponse userDel(nmg_user_info nmg_user_info) {
        CardResponse cardResponse = new CardResponse();
        if (null == nmg_user_info.getUserId()) {
            cardResponse.setResCode(CodeEnum.nullValue.getCode());
            cardResponse.setResDesc(CodeEnum.nullValue.getDesc());
        } else {
            nmg_user_infoMapper.userDel(nmg_user_info.getUserId());
        }
        return cardResponse;
    }

    public CardResponse roleManage(String data) {
        CardResponse cardResponse = new CardResponse();
        if (data != null) {
            try {
                Map param = new HashMap();
                JSONObject jsonObject = JSONObject.parseObject(data);
                if (null != jsonObject.get("createPeople")) {
                    param.put("createPeople",jsonObject.get("createPeople"));
                }
                if (null != jsonObject.get("role_id")) {
                    param.put("role_id",jsonObject.get("role_id"));
                }
                Map res = new HashMap();
                res.put("role",nmg_user_roleMapper.userRole(param));
                cardResponse.setResBody(res);
            } catch (Exception e) {
                cardResponse.setResDesc(e.getMessage());
                cardResponse.setResCode(CodeEnum.failed.getCode());
            }
        } else {
            cardResponse.setResCode(CodeEnum.nullValue.getCode());
            cardResponse.setResDesc(CodeEnum.nullValue.getDesc());
        }
        return cardResponse;
    }


    @Transactional
    public CardResponse userImport(MultipartFile file) {
        CardResponse cardResponse = new CardResponse();
        if (file != null) {
            try {
                InputStream inputStream = file.getInputStream();
                HSSFWorkbook xssfWorkbook = new HSSFWorkbook(inputStream);
                int numberOfSheets = xssfWorkbook.getNumberOfSheets();
                Map param = new HashMap();
                for (int i = 0; i < numberOfSheets; i++) {
                    HSSFSheet sheetAt = xssfWorkbook.getSheetAt(i);
                    int lastRowNum = sheetAt.getLastRowNum();
                    for (int j = 1; j <= lastRowNum; j++) {
                        nmg_user_info nmg_user_info = new nmg_user_info();
                        HSSFRow row = sheetAt.getRow(j);
                        nmg_user_info.setUserId(new RandomUtil().uuid);
                        nmg_user_info.setUserTel(row.getCell(0).getStringCellValue());
                        nmg_user_info.setUserPass(row.getCell(1).getStringCellValue());
                        nmg_user_info.setUserName(row.getCell(2).getStringCellValue());
                        param.put("cityName",row.getCell(3).getStringCellValue());
                        nmg_user_info.setCityCode(nmg_city_infoMapper.cityInfo(param).get(0).getCityCode());
                        param.put("role_name",row.getCell(4).getStringCellValue());
                        String role = nmg_user_roleMapper.userRole(param).get(0).get("role_id").toString();
                        nmg_user_info.setUserRole(role);
                        nmg_user_info.setUserType(role);
                        nmg_user_info.setCreateTime(DateUtil.getDateString());
                        row.getCell(6).setCellType(Cell.CELL_TYPE_STRING);
                        nmg_user_info.setCreatePeople(row.getCell(6).getStringCellValue());
                        nmg_user_infoMapper.insert(nmg_user_info);
                    }
                }
            } catch (Exception e) {
                cardResponse.setResDesc(e.getMessage());
                cardResponse.setResCode(CodeEnum.failed.getCode());
            }
        } else {
            cardResponse.setResCode(CodeEnum.nullValue.getCode());
            cardResponse.setResDesc(CodeEnum.nullValue.getDesc());
        }
        return cardResponse;
    }

    public CardResponse userExport(String data) {
        CardResponse cardResponse = new CardResponse();
        String fileName = path;
        Map param = new HashMap();
        if (data != null) {
            try {
                JSONObject jsonObject = JSONObject.parseObject(data);
                HSSFWorkbook hssfWorkbook = new HSSFWorkbook();
                HSSFSheet sheet= hssfWorkbook.createSheet("用户信息");
                HSSFRow row = sheet.createRow(0);
                HSSFCell cell = row.createCell(0);
                cell.setCellValue("账号");
                cell = row.createCell(1);
                cell.setCellValue("密码");
                cell = row.createCell(2);
                cell.setCellValue("姓名");
                cell = row.createCell(3);
                cell.setCellValue("盟市");
                cell = row.createCell(4);
                cell.setCellValue("角色名称");
                cell = row.createCell(5);
                cell.setCellValue("创建时间");
                cell = row.createCell(6);
                cell.setCellValue("创建人账户");
                if (null != jsonObject.get("userName")) {
                    param.put("userName",jsonObject.get("userName"));
                }
                if (null != jsonObject.get("userTel")) {
                    param.put("userTel",jsonObject.get("userTel"));
                }
                if (null != jsonObject.get("userType")) {
                    param.put("userType",jsonObject.get("userType"));
                }
                List<Map<String,Object>> result = nmg_user_infoMapper.allUserInfo(param);
                for (int i = 0; i < result.size(); i++) {
                    Map maps = result.get(i);
                    row = sheet.createRow(i+1);
                    if (maps.get("user_tel") != null) {
                        row.createCell(0).setCellValue((String) maps.get("user_tel"));
                        if (i == 0) {
                            fileName = fileName + DateUtil.getDateString() +"用户信息.xls";
                        }
                    }
                    if (maps.get("user_pass") != null) {
                        row.createCell(1).setCellValue((String) maps.get("user_pass"));
                    }
                    if (maps.get("user_name") != null) {
                        row.createCell(2).setCellValue((String) maps.get("user_name"));
                    }
                    if (maps.get("city_code") != null) {
                        param.put("city",maps.get("city"));
                        row.createCell(3).setCellValue(nmg_city_infoMapper.cityInfo(param).get(0).getCityName());
                    }
                    if (maps.get("user_role") != null) {
                        param.put("role_id",maps.get("user_role"));
                        row.createCell(4).setCellValue(nmg_user_roleMapper.userRole(param).get(0).get("role_name").toString());
                    }
                    if (maps.get("create_time") != null) {
                        row.createCell(5).setCellValue((String) maps.get("create_time"));
                    }
                    if (maps.get("create_people") != null) {
                        row.createCell(6).setCellValue((String) maps.get("create_people"));
                    }
                }
                FileOutputStream fileOutputStream = new FileOutputStream(fileName);
                hssfWorkbook.write(fileOutputStream);
                fileOutputStream.close();
                hssfWorkbook.close();
                cardResponse.setResDesc(fileName);
            } catch (Exception e) {
                cardResponse.setResDesc(e.getMessage());
                cardResponse.setResCode(CodeEnum.failed.getCode());
            }
        } else {
            cardResponse.setResCode(CodeEnum.nullValue.getCode());
            cardResponse.setResDesc(CodeEnum.nullValue.getDesc());
        }
        return cardResponse;
    }

    @Transactional
    public CardResponse roleAdd(nmg_user_role nmg_user_role) {
        CardResponse cardResponse = new CardResponse();
        nmg_user_role.setRoleId(new RandomUtil().uuid);
        nmg_user_roleMapper.insert(nmg_user_role);
        return cardResponse;
    }

    @Transactional
    public CardResponse roleDel(nmg_user_role nmg_user_role) {
        CardResponse cardResponse = new CardResponse();
        nmg_user_roleMapper.roleDel(nmg_user_role.getRoleId());
        return cardResponse;
    }

    @Transactional
    public CardResponse roleUpdate(nmg_user_role nmg_user_role) {
        CardResponse cardResponse = new CardResponse();
        nmg_user_roleMapper.roleUpdate(nmg_user_role);
        return cardResponse;
    }
}
