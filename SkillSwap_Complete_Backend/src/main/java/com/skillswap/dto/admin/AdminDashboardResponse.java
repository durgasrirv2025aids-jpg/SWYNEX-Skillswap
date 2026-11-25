package com.skillswap.dto.admin;

public class AdminDashboardResponse {

    private long totalStudents;
    private long activeStudents;
    private long disabledStudents;
    private long totalSkills;
    private long totalTeachingSkills;
    private long totalLearningSkills;
    private long totalExchangeRequests;
    private long pendingRequests;
    private long acceptedRequests;
    private long rejectedRequests;
    private long cancelledRequests;
    private long totalConnections;

    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }

    public long getActiveStudents() { return activeStudents; }
    public void setActiveStudents(long activeStudents) { this.activeStudents = activeStudents; }

    public long getDisabledStudents() { return disabledStudents; }
    public void setDisabledStudents(long disabledStudents) { this.disabledStudents = disabledStudents; }

    public long getTotalSkills() { return totalSkills; }
    public void setTotalSkills(long totalSkills) { this.totalSkills = totalSkills; }

    public long getTotalTeachingSkills() { return totalTeachingSkills; }
    public void setTotalTeachingSkills(long totalTeachingSkills) { this.totalTeachingSkills = totalTeachingSkills; }

    public long getTotalLearningSkills() { return totalLearningSkills; }
    public void setTotalLearningSkills(long totalLearningSkills) { this.totalLearningSkills = totalLearningSkills; }

    public long getTotalExchangeRequests() { return totalExchangeRequests; }
    public void setTotalExchangeRequests(long totalExchangeRequests) { this.totalExchangeRequests = totalExchangeRequests; }

    public long getPendingRequests() { return pendingRequests; }
    public void setPendingRequests(long pendingRequests) { this.pendingRequests = pendingRequests; }

    public long getAcceptedRequests() { return acceptedRequests; }
    public void setAcceptedRequests(long acceptedRequests) { this.acceptedRequests = acceptedRequests; }

    public long getRejectedRequests() { return rejectedRequests; }
    public void setRejectedRequests(long rejectedRequests) { this.rejectedRequests = rejectedRequests; }

    public long getCancelledRequests() { return cancelledRequests; }
    public void setCancelledRequests(long cancelledRequests) { this.cancelledRequests = cancelledRequests; }

    public long getTotalConnections() { return totalConnections; }
    public void setTotalConnections(long totalConnections) { this.totalConnections = totalConnections; }
}
