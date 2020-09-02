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
import java.util.Base64;

public class Base64NamesEncoder {

	public static boolean DEBUG = false;

	public static void main(String[] args) {

		System.out.println("debug flag is " + DEBUG);

		Base64NamesEncoder dumper = new Base64NamesEncoder();

		File input = new File(new File(System.getProperty("user.dir")), "classification.30000.budget.VAL.csv");
		File output = new File(input.getParentFile(), input.getName().replaceAll(".csv", ".base64.csv"));

		try {
			dumper.dump(input, output);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	public Base64NamesEncoder() {

	}

	private boolean shouldEncode(String fileName, int colIndex) {

		if (fileName.startsWith("classification")) {
			// int[] colsToEncode = { 3 , 9 , 10 ,  40, 41};
			// Title Genres Studio Crew Actors
			if (colIndex == 3 || colIndex == 9 || colIndex == 10 || colIndex == 40 || colIndex == 41) {
				return true;
			} else {
				return false;
			}
					
		} else {
			// Title Genres Studio Crew Actors
			if (colIndex == 1 || colIndex == 5 || colIndex == 6 || colIndex == 36 || colIndex == 37) {
				return true;
			} else {
				return false;
			}
		}

	}

	private String encode(String colValue) {
		return Base64.getEncoder().encodeToString(colValue.getBytes(StandardCharsets.ISO_8859_1));
	}

	private void dump(File input, File outputMovie) throws IOException {

		FileReader fr = new FileReader(input, StandardCharsets.ISO_8859_1); // reads the file
		BufferedReader br = new BufferedReader(fr); // creates a buffering character input stream
		// StringBuffer sb = new StringBuffer(); // constructs a string buffer with no
		// characters

		ByteArrayOutputStream baosMovie = new ByteArrayOutputStream();
		Writer writerMovie = new BufferedWriter(new OutputStreamWriter(baosMovie));
		if (!DEBUG) {
			writerMovie = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(outputMovie, false)));
		}

		String line;
//		int iteration = 0;
		int count = 0;

		while ((line = br.readLine()) != null) {

			try {
//				if (iteration == 0) {
//					iteration++;
//					continue;
//				}

				if (count == 0) {
					// no base64 on header !
					writerMovie.write(line + "\r\n");
				} else {

					String[] lineSplitted = line.split(",");

					StringBuilder sb = new StringBuilder();
					for (int i = 0; i < lineSplitted.length; i++) {
						{
							if (i > 0) {
								sb.append(',');
							}
							if (shouldEncode(input.getName(), i)) {
								sb.append(encode(lineSplitted[i]));
							} else {
								sb.append(lineSplitted[i]);
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

				}

				count++;
			} catch (Throwable t) {
				System.err.println("problem " + t.getClass().getName() + "\t\t" + t.getMessage());
			}
		}

		br.close();
		fr.close();
		writerMovie.close();
	}

}
