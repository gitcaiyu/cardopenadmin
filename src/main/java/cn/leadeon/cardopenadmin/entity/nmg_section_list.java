package cn.leadeon.cardopenadmin.entity;

import lombok.Data;

@Data
public class nmg_section_list {
    private String section;

    private String cityCode;

    private Long id;

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public String getCityCode() {
        return cityCode;
    }

    public void setCityCode(String cityCode) {
        this.cityCode = cityCode;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}