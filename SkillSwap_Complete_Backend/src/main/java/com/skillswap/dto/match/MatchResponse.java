package com.skillswap.dto.match;

import java.util.List;

public class MatchResponse {

    private Long currentStudentId;
    private int totalMatches;
    private List<MatchedStudentResponse> matches;

    public MatchResponse() {}

    public MatchResponse(Long currentStudentId, int totalMatches, List<MatchedStudentResponse> matches) {
        this.currentStudentId = currentStudentId;
        this.totalMatches = totalMatches;
        this.matches = matches;
    }

    public Long getCurrentStudentId() { return currentStudentId; }
    public void setCurrentStudentId(Long currentStudentId) { this.currentStudentId = currentStudentId; }

    public int getTotalMatches() { return totalMatches; }
    public void setTotalMatches(int totalMatches) { this.totalMatches = totalMatches; }

    public List<MatchedStudentResponse> getMatches() { return matches; }
    public void setMatches(List<MatchedStudentResponse> matches) { this.matches = matches; }
}
