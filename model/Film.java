package model;


import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Film {
	private String name;
	private String genre;
	private String classification;
	private String studio;
	private int duration;
	private Long budget;
	private Date releaseDate;
	private Long boxOfficeResult;
	private ArrayList<CrewMember>crewMembers;
	private ArrayList<String>actors;
	
	public Film() {
		
	}
	
	public Film(String name, String genre, String classification, String studio, int duration, Long budget,
			Date releaseDate, Long boxOfficeResult, ArrayList<CrewMember> crewMembers, ArrayList<String> actors) {
		super();
		this.name = name;
		this.genre = genre;
		this.classification = classification;
		this.studio = studio;
		this.duration = duration;
		this.budget = budget;
		this.releaseDate = releaseDate;
		this.boxOfficeResult = boxOfficeResult;
		this.crewMembers = crewMembers;
		this.actors = actors;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getGenre() {
		return genre;
	}
	public void setGenre(String genre) {
		this.genre = genre;
	}
	public String getClassification() {
		return classification;
	}
	public void setClassification(String classification) {
		this.classification = classification;
	}
	public String getStudio() {
		return studio;
	}
	public void setStudio(String studio) {
		this.studio = studio;
	}
	public int getDuration() {
		return duration;
	}
	public void setDuration(int duration) {
		this.duration = duration;
	}
	public Long getBudget() {
		return budget;
	}
	public void setBudget(Long budget) {
		this.budget = budget;
	}
	public Date getReleaseDate() {
		return releaseDate;
	}
	public void setReleaseDate(Date releaseDate) {
		this.releaseDate = releaseDate;
	}
	public Long getBoxOfficeResult() {
		return boxOfficeResult;
	}
	public void setBoxOfficeResult(Long boxOfficeResult) {
		this.boxOfficeResult = boxOfficeResult;
	}
	public ArrayList<CrewMember> getCrewMembers() {
		return crewMembers;
	}
	public void setCrewMembers(ArrayList<CrewMember> crewMembers) {
		this.crewMembers = crewMembers;
	}
	public ArrayList<String> getActors() {
		return actors;
	}
	public void setActors(ArrayList<String> actors) {
		this.actors = actors;
	}

	@Override
	public String toString() {
		return "Film [name=" + name + ", genre=" + genre + ", classification=" + classification + ", studio=" + studio
				+ ", duration=" + duration + ", budget=" + budget + ", releaseDate=" + releaseDate
				+ ", boxOfficeResult=" + boxOfficeResult + ", crewMembers=" + crewMembers + ", actors=" + actors + "]";
	}
	
}
