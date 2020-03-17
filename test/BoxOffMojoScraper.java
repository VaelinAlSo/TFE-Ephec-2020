package test;

import static org.junit.jupiter.api.Assertions.assertTrue;
import java.util.List;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;

import javax.print.Doc;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.Node;
import org.jsoup.nodes.TextNode;
import org.jsoup.select.Elements;
import org.junit.jupiter.api.Test;

import model.CrewMember;
import model.Film;
import util.WriteToCSV;

class BoxOffMojoScraper {

	@Test
	void testGetMovie() throws IOException {
		getMovieData("tt0167260");
	}
	

	void getMovieData(String idMovie) throws IOException {
		// fail("Not yet implemented");
		
		Document doc = Jsoup.connect("https://www.boxofficemojo.com/title/" + idMovie + "/credits/?ref_=bo_tt_tab#tabs")
				.userAgent("Mozilla/5.0 (Windows; U; WindowsNT 5.1; en-US; rv1.8.1.6) Gecko/20070725 Firefox/2.0.0.6")
				.referrer("https://www.boxofficemojo.com").timeout(0).get();

		// System.out.println(doc.data());
		try {
			Film film = new Film();
		ArrayList<String> actors = new ArrayList<String>();
		ArrayList<CrewMember> crewMembers = new ArrayList<CrewMember>();
		fillMoney(doc, film);
		fillSummaryTable(doc, film);
		fillCrewMemberAndActor(doc, crewMembers, actors, film);
		System.out.println(film.toString());
		//WriteToCSV writer = new  WriteToCSV();
		WriteToCSV.writeToCSV(film);
		} catch (Throwable t) {
			System.err.println("problem with " + idMovie);
			t.printStackTrace();
		}
		
	}

	private void fillCrewMemberAndActor(Document doc, ArrayList<CrewMember> crewMembers, ArrayList<String> actors,
			Film film) {
		for (Element row : doc.select("#principalCrew tr")) {
			CrewMember crewMember = new CrewMember(row.select("td:eq(0)").text(), row.select("td:eq(1)").text());
			crewMembers.add(crewMember);

		}
		film.setCrewMembers(crewMembers);

		for (Element row : doc.select("#principalCast tr")) {

			actors.add(row.select("td:eq(0)").text());
		}
		film.setActors(actors);
	}

	private void fillSummaryTable(Document doc, Film film) {
		Elements title = doc.getElementsByClass("a-size-extra-large");
		String titleFilm = title.first().text().toString();
		titleFilm = titleFilm.replace(",", " ");
		film.setName(titleFilm);
		Elements spansInfo = doc.getElementsByClass("a-section a-spacing-none mojo-gutter mojo-summary-table").first()
				.getElementsByClass("a-section a-spacing-none");
		// System.out.println(doc.selectFirst(" > html > body > div:eq(1) > main > div >
		// div:eq(3) > div:eq(4) > div:eq(5) > span:eq(2)"));

		for (Element element : spansInfo) {
			Elements infos = element.select("div > span:eq(0)");
			Elements infos1 = element.select("div > span:eq(1)");
			String text1 = infos1.text();
			String text = infos.text();
			if (text1.trim().length() > 0 && !text.contains("IMDbPro")) {
				switch (text) {
				case "Domestic Distributor":
					film.setStudio(filterSuffix(text1, "See full company information"));

					break;
				case "Budget":
					film.setBudget(filterPrefixDollar(text1));
					break;
				case "Genres":
					film.setGenre(text1);
					break;
				case "MPAA":
					film.setClassification(text1);
					break;
				case "Running Time":
					film.setDuration(convertMinute(text1));
					break;
				case "Earliest Release Date":
					film.setReleaseDate(convertDate(text1));
					break;
				default:
					break;
				}
				// System.out.print(text.toString() + "\t");

				// System.out.println(text1.toString());
			}

		}
	}

	private Date convertDate(String text1) {
		String[] lineSplitted = text1.split("\\(");
		DateFormat fmt = new SimpleDateFormat("MMMM dd, yyyy", Locale.US);
		try {
			Date d = fmt.parse(lineSplitted[0]);
			return d;
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}

	}

	private int convertMinute(String text1) {
		
		int nbMinutes = 0;
		text1 = text1.replace(" ", "");
		text1 = text1.replace("min", "");
		if(text1.contains("hr")) {
		String[] lineSplitted = text1.split("hr");
		
		nbMinutes += Integer.parseInt(lineSplitted[0]) * 60;
		if(lineSplitted.length>1) {
			
		
		nbMinutes += Integer.parseInt(lineSplitted[1]);
		}
		return nbMinutes;
		}
		else {
			return Integer.parseInt(text1);
		}
			
	}

	private static Long filterPrefixDollar(String text) {
		// TODO Auto-generated method stub
		// return Integer.parseInt(text.substring(1).trim());

		NumberFormat df = NumberFormat.getCurrencyInstance(Locale.US);
		try {
			return (Long) df.parse(text);
		} catch (ParseException e) {
			return null;
		}
	}

	private static String filterSuffix(String text1, String suffix) {

		return text1.replace(" " + suffix, "");
	}

	private void fillMoney(Document doc, Film film) {
		Elements spansMoney = doc.getElementsByClass("money");
		for (Element spanM : spansMoney) {
			Node parentNode1 = spanM.parentNode();
			Node parentNode2 = parentNode1.parentNode();
			// String dataParent2 = parentNode2.toString();

			if (parentNode2.toString().contains("Domestic")) {
				continue;
			}
			String pNode2Str = parentNode2.toString();
			Node parentNode3 = parentNode2.parentNode();
			String pNode3Str = parentNode3.toString();
			if (pNode2Str.contains("International")) {
				continue;

			} else if (pNode2Str.contains("Worldwide")) {
				// TODO get value of money
				for (Node subNode : spanM.childNodes()) {
					// if (subNode instanceof TextNode)
					// {
					assertTrue(subNode.toString().startsWith("$"));
					// System.out.println("Worldwide box office : " +subNode.toString());
					// }
					film.setBoxOfficeResult(filterPrefixDollar(subNode.toString()));
				}
			}
			

		}
	}

	/*
	*
	*/
}
