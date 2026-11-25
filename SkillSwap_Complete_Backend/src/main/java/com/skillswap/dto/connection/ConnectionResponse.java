package com.skillswap.dto.connection;

import java.time.LocalDateTime;

public class ConnectionResponse {

    private Long connectionId;
    private Long partnerId;
    private String partnerName;
    private String partnerEmail;
    private String partnerCollege;
    private String partnerDepartment;
    private Integer partnerYearOfStudy;
    private String partnerBio;
    private String exchangedSkillsSummary;
    private LocalDateTime connectedAt;

    public Long getConnectionId() { return connectionId; }
    public void setConnectionId(Long connectionId) { this.connectionId = connectionId; }

    public Long getPartnerId() { return partnerId; }
    public void setPartnerId(Long partnerId) { this.partnerId = partnerId; }

    public String getPartnerName() { return partnerName; }
    public void setPartnerName(String partnerName) { this.partnerName = partnerName; }

    public String getPartnerEmail() { return partnerEmail; }
    public void setPartnerEmail(String partnerEmail) { this.partnerEmail = partnerEmail; }

    public String getPartnerCollege() { return partnerCollege; }
    public void setPartnerCollege(String partnerCollege) { this.partnerCollege = partnerCollege; }

    public String getPartnerDepartment() { return partnerDepartment; }
    public void setPartnerDepartment(String partnerDepartment) { this.partnerDepartment = partnerDepartment; }

    public Integer getPartnerYearOfStudy() { return partnerYearOfStudy; }
    public void setPartnerYearOfStudy(Integer partnerYearOfStudy) { this.partnerYearOfStudy = partnerYearOfStudy; }

    public String getPartnerBio() { return partnerBio; }
    public void setPartnerBio(String partnerBio) { this.partnerBio = partnerBio; }

    public String getExchangedSkillsSummary() { return exchangedSkillsSummary; }
    public void setExchangedSkillsSummary(String exchangedSkillsSummary) { this.exchangedSkillsSummary = exchangedSkillsSummary; }

    public LocalDateTime getConnectedAt() { return connectedAt; }
    public void setConnectedAt(LocalDateTime connectedAt) { this.connectedAt = connectedAt; }
}
