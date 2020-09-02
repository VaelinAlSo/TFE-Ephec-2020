package datatransformers;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.SortedMap;
import java.util.TreeMap;

public class DemultiplyConcatColumnsDumper {

	public static boolean DEBUG = false;

	public static final String genresConcat = "Action|War|History|Western|Documentary|Sport|Thriller|News|Biography|Adult|Comedy|Mystery|Musical|Talk-Show|Adventure|Horror|Romance|Sci-Fi|Drama|null|Music|Crime|Fantasy|Family|Animation|Reality-TV";

	SortedMap<String, Integer> genresClassifier = new TreeMap<String, Integer>();

	public static void main(String[] args) {

//		int maxGenres = Integer.parseInt(args[0]);
//		int maxCrew = Integer.parseInt(args[1]);
//		int maxActors = Integer.parseInt(args[2]);

		System.out.println("debug flag is " + DEBUG);

		DemultiplyConcatColumnsDumper dumper = new DemultiplyConcatColumnsDumper();

		File input = new File(new File(System.getProperty("user.dir")), "filmsDataSetWithID.csv");
		File outputM = new File(input.getParentFile(), "MainMovies26Genres.csv");
		File outputCrew = new File(input.getParentFile(), "DatedCrew.csv");
		File outputActors = new File(input.getParentFile(), "DatedActors.csv");

		try {
			dumper.dump(input, outputM, outputCrew, outputActors);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	public DemultiplyConcatColumnsDumper() {
		String[] genresArray = genresConcat.split("\\|");
		Arrays.sort(genresArray);
		for (int i = 0; i < genresArray.length; i++) {
			genresClassifier.put(genresArray[i], i);
		}
		if (DEBUG) {
			System.out.println(genresClassifier.keySet());
		}

	}

	private int[] getGenres(String concatGenresFor1Movie) {
		String[] genresMovie = concatGenresFor1Movie.split(" ");
		int[] result = new int[genresClassifier.size()];
		for (int i = 0; i < result.length; i++) {
			result[i] = 0;
		}
		for (int i = 0; i < genresMovie.length; i++) {
			result[genresClassifier.get(genresMovie[i])] = 1;
		}
		return result;
	}

	private void dump(File input, File outputMovie, File outputCrew, File outputActors) throws IOException {

		FileReader fr = new FileReader(input, StandardCharsets.ISO_8859_1); // reads the file
		BufferedReader br = new BufferedReader(fr); // creates a buffering character input stream
		// StringBuffer sb = new StringBuffer(); // constructs a string buffer with no
		// characters

		ByteArrayOutputStream baosMovie = new ByteArrayOutputStream();
		Writer writerMovie = new BufferedWriter(new OutputStreamWriter(baosMovie));
		if (!DEBUG) {
			writerMovie = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(outputMovie, false)));
		}

		ByteArrayOutputStream baosCrew = new ByteArrayOutputStream();
		Writer writerCrew = new BufferedWriter(new OutputStreamWriter(baosCrew));
		if (!DEBUG) {
			writerCrew = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(outputCrew, false)));
		}

		ByteArrayOutputStream baosActors = new ByteArrayOutputStream();
		Writer writerActors = new BufferedWriter(new OutputStreamWriter(baosActors));
		if (!DEBUG) {
			writerActors = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(outputActors, false)));
		}

		String line;
//		int iteration = 0;
		int count = 0;

		writerMovie.write(constructHeaderLine(genresClassifier));

		while ((line = br.readLine()) != null) {

			try {
//				if (iteration == 0) {
//					iteration++;
//					continue;
//				}

				String[] lineSplitted = line.split(",");

				String crewStr = "";
				String actorsStr = "";
				if (lineSplitted.length > 10) {
					crewStr = lineSplitted[10];
					if (lineSplitted.length > 11) {
						actorsStr = lineSplitted[11];
					}
				}

				String[] splitRoles = crewStr.split("\\|");
				String[] splitActors = actorsStr.split("\\|");

				// String[] splitGenres = lineSplitted[5].split(" ");

				StringBuilder sb = new StringBuilder();
				for (int i = 0; i < 10; i++) {
					// if (i != 5)   // keep  genres 
					{
						if (i > 0) {
							sb.append(',');
						}
						sb.append(lineSplitted[i]);
					}
				}

//				String[] genres = new String[maxGenres];
//				genres = Arrays.copyOf(splitGenres, maxGenres);

				int[] genresFlag = getGenres(lineSplitted[5]);

				sb.append(',');
				
				
				for (int i = 0; i < genresFlag.length; i++) {
					sb.append(genresFlag[i]);
					sb.append(',');
				}

				sb.append(crewStr);
				sb.append(',');
				sb.append(actorsStr);

				String id = lineSplitted[0];
				String year = lineSplitted[2];

				for (int i = 0; i < splitActors.length; i++) {
					if (splitActors[i].length() != 0) {
						String[] actorAndRoleSplit = splitActors[i].split(" : ");
						String actorExploded = id + "," + year + "," + actorAndRoleSplit[0] + "," + actorAndRoleSplit[1]
								+ "\r\n";
						writerActors.write(actorExploded);
						if (DEBUG) {
							System.out.print("actor\t" + actorExploded);
						}
					}
				}
				for (int i = 0; i < splitRoles.length; i++) {
					if (splitRoles[i].length() != 0) {
						String[] crewAndRoleSplit = splitRoles[i].split(" : ");
						String roleExploded = id + "," + year + "," + crewAndRoleSplit[0] + "," + crewAndRoleSplit[1]
								+ "\r\n";
						writerCrew.write(roleExploded);
						if (DEBUG) {
							System.out.print("role\t" + roleExploded);
						}
					}
				}

				sb.append("\r\n");

				writerMovie.write(sb.toString());
				int periodLogThreshold = 1000;
				int stopThreshold = 100000;

				if (DEBUG) {
					periodLogThreshold = 1;
					stopThreshold = 100;
				}

				if (count % periodLogThreshold == 0) {
					// break;
					System.out.println(count + "\t\t" + sb.toString());
				}

				if ((count != 0) && (count % stopThreshold == 0)) {
					break;

					// System.out.println(count + "\t\t" + char2 + "\t\t" + lineSplitted[0]);
				}
				count++;
			} catch (Throwable t) {
				System.err.println("problem " + t.getClass().getName() + "\t\t" + t.getMessage());
			}
		}

		br.close();
		fr.close();
		writerMovie.close();
		writerCrew.close();
		writerActors.close();
	}

	private String constructHeaderLine(SortedMap<String, Integer> genres) {
		StringBuilder sb = new StringBuilder();
		sb.append("Id,");
		sb.append("Title,");
		sb.append("Year,");
		sb.append("Code,");
		sb.append("Duration,");
		// keep Genres
		sb.append("Genres,");
		sb.append("Studio,");
		sb.append("Budget,");
		sb.append("Result,");
		sb.append("Date");

		for (String genre : genres.keySet()) {
			sb.append(",");
			sb.append(genre);
		}

		sb.append(",Crew");
		sb.append(",Actors");

		sb.append("\r\n");

		return sb.toString();
	}

}
