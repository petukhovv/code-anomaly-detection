# code-anomaly-detection

Program for anomaly detection in Kotlin source code.

## Big and complex enums

### Example 1

test 1

```
package com.exsilicium.scripture.shared.model

import java.text.ParseException

/**
 * A list of all Bible Books.
 *
 * @property title The title of the Book.
 * @property abbreviations The common English abbreviations corresponding to the Book.
 * @property versesPerChapter A list of the numbers of verses per chapter in the Book.
 *
 * Information from [E.N.T.E.R.](http://catholic-resources.org/Bible/).
 */
enum class Book(
        val title: String,
        val abbreviations: List<String>,
        private val versesPerChapter: List<Int>
) {
    GENESIS("Genesis",
            listOf("Gen", "Ge", "Gn"),
            listOf(31, 25, 24, 26, 32, 22, 24, 22, 29, 32, 32, 20, 18, 24, 21, 16, 27, 33, 38, 18, 34, 24, 20, 67, 34,
                    35, 46, 22, 35, 43, 54, 33, 20, 31, 29, 43, 36, 30, 23, 23, 57, 38, 34, 34, 28, 34, 31, 22, 33, 26)
    ),
    EXODUS("Exodus",
            listOf("Exo", "Ex", "Exod"),
            listOf(22, 25, 22, 31, 23, 30, 29, 28, 35, 29, 10, 51, 22, 31, 27, 36, 16, 27, 25, 26, 37, 30, 33, 18, 40,
                    37, 21, 43, 46, 38, 18, 35, 23, 35, 35, 38, 29, 31, 43, 38)
    ),
    LEVITICUS("Leviticus",
            listOf("Lev", "Le", "Lv"),
            listOf(17, 16, 17, 35, 26, 23, 38, 36, 24, 20, 47, 8, 59, 57, 33, 34, 16, 30, 37, 27, 24, 33, 44, 23, 55,
                    46, 34)
    ),
    NUMBERS("Numbers",
            listOf("Num", "Nu", "Nm", "Nb"),
            listOf(54, 34, 51, 49, 31, 27, 89, 26, 23, 36, 35, 16, 33, 45, 41, 35, 28, 32, 22, 29, 35, 41, 30, 25, 19,
                    65, 23, 31, 39, 17, 54, 42, 56, 29, 34, 13)
    ),
    DEUTERONOMY("Deuteronomy",
            listOf("Deut", "Dt"),
            listOf(46, 37, 29, 49, 33, 25, 26, 20, 29, 22, 32, 31, 19, 29, 23, 22, 20, 22, 21, 20, 23, 29, 26, 22, 19,
                    19, 26, 69, 28, 20, 30, 52, 29, 12)
    ),
    JOSHUA("Joshua",
            listOf("Josh", "Jos", "Jsh"),
            listOf(18, 24, 17, 24, 15, 27, 26, 35, 27, 43, 23, 24, 33, 15, 63, 10, 18, 28, 51, 9, 45, 34, 16, 33)
    ),
    JUDGES("Judges",
            listOf("Judg", "Jdg", "Jg", "Jdgs"),
            listOf(36, 23, 31, 24, 31, 40, 25, 35, 57, 18, 40, 15, 25, 20, 20, 31, 13, 31, 30, 48, 25)
    ),
    RUTH("Ruth",
            listOf("Rth", "Ru"),
            listOf(22, 23, 18, 22)
    ),
    FIRST_SAMUEL("1 Samuel",
            listOf("1 Sam", "1 Sa", "1Samuel", "1S", "I Sa", "1 Sm", "1Sa", "I Sam", "1Sam", "I Samuel", "1st Samuel",
                    "First Samuel"),
            listOf(28, 36, 21, 22, 12, 21, 17, 22, 27, 27, 15, 25, 23, 52, 35, 23, 58, 30, 24, 42, 16, 23, 28, 23, 43,
                    25, 12, 25, 11, 31, 13)
    ),
    SECOND_SAMUEL("2 Samuel",
            listOf("2 Sam", "2 Sa", "2S", "II Sa", "2 Sm", "2Sa", "II Sam", "2Sam", "II Samuel", "2Samuel",
                    "2nd Samuel", "Second Samuel"),
            listOf(27, 32, 39, 12, 25, 23, 29, 18, 13, 19, 27, 31, 39, 33, 37, 23, 29, 32, 44, 26, 22, 51, 39, 25)
    ),
    FIRST_KINGS("1 Kings",
            listOf("1 Kgs", "1 Ki", "1K", "I Kgs", "1Kgs", "I Ki", "1Ki", "I Kings", "1Kings", "1st Kgs", "1st Kings",
                    "First Kings", "First Kgs", "1Kin"),
            listOf(53, 46, 28, 20, 32, 38, 51, 66, 28, 29, 43, 33, 34, 31, 34, 34, 24, 46, 21, 43, 29, 54)
    ),
    SECOND_KINGS("2 Kings",
            listOf("2 Kgs", "2 Ki", "2K", "II Kgs", "2Kgs", "II Ki", "2Ki", "II Kings", "2Kings", "2nd Kgs",
                    "2nd Kings", "Second Kings", "Second Kgs", "2Kin"),
            listOf(18, 25, 27, 44, 27, 33, 20, 29, 37, 36, 20, 22, 25, 29, 38, 20, 41, 37, 37, 21, 26, 20, 37, 20, 30)
    ),
    FIRST_CHRONICLES("1 Chronicles",
            listOf("1 Chron", "1 Ch", "I Ch", "1Ch", "1 Chr", "I Chr", "1Chr", "I Chron", "1Chron", "I Chronicles",
                    "1Chronicles", "1st Chronicles", "First Chronicles"),
            listOf(54, 55, 24, 43, 41, 66, 40, 40, 44, 14, 47, 41, 14, 17, 29, 43, 27, 17, 19, 8, 30, 19, 32, 31, 31,
                    32, 34, 21, 30)
    ),
    SECOND_CHRONICLES("2 Chronicles",
            listOf("2 Chron", "2 Ch", "II Ch", "2Ch", "II Chr", "2Chr", "II Chron", "2Chron", "II Chronicles",
                    "2Chronicles", "2nd Chronicles", "Second Chronicles"),
            listOf(18, 17, 17, 22, 14, 42, 22, 18, 31, 19, 23, 16, 23, 14, 19, 14, 19, 34, 11, 37, 20, 12, 21, 27, 28,
                    23, 9, 27, 36, 27, 21, 33, 25, 33, 26, 23)
    ),
    EZRA("Ezra",
            listOf("Ezr"),
            listOf(11, 70, 13, 24, 17, 22, 28, 36, 15, 44)
    ),
    NEHEMIAH("Nehemiah",
            listOf("Neh", "Ne"),
            listOf(11, 20, 38, 17, 19, 19, 72, 18, 37, 40, 36, 47, 31)
    ),
    ESTHER("Esther",
            listOf("Esth", "Es"),
            listOf(22, 23, 15, 17, 14, 14, 10, 17, 32, 3, 17, 8, 30, 16, 24, 10)
    ),
    JOB("Job",
            listOf("Jb"),
            listOf(22, 13, 26, 21, 27, 30, 21, 22, 35, 22, 20, 25, 28, 22, 35, 22, 16, 21, 29, 29, 34, 30, 17, 25, 6,
                    14, 23, 28, 25, 31, 40, 22, 33, 37, 16, 33, 24, 41, 30, 32, 26, 17)
    ),
    PSALMS("Psalms",
            listOf("Pslm", "Ps", "Psa", "Psm", "Pss"),
            listOf(6, 11, 9, 9, 13, 11, 18, 10, 21, 18, 7, 9, 6, 7, 5, 11, 15, 51, 15, 10, 14, 32, 6, 10, 22, 11, 14, 9,
                    11, 13, 25, 11, 22, 23, 28, 13, 40, 23, 14, 18, 14, 12, 5, 27, 18, 12, 10, 15, 21, 23, 21, 11, 7, 9,
                    24, 14, 12, 12, 18, 14, 9, 13, 12, 11, 14, 20, 8, 36, 37, 6, 24, 20, 28, 23, 11, 13, 21, 72, 13, 20,
                    17, 8, 19, 13, 14, 17, 7, 19, 53, 17, 16, 16, 5, 23, 11, 13, 12, 9, 9, 5, 8, 29, 22, 35, 45, 48, 43,
                    14, 31, 7, 10, 10, 9, 8, 18, 19, 2, 29, 176, 7, 8, 9, 4, 8, 5, 6, 5, 6, 8, 8, 3, 18, 3, 3, 21, 26,
                    9, 8, 24, 14, 10, 8, 12, 15, 21, 10, 20, 14, 9, 6)
    ),
    PROVERBS("Proverbs",
            listOf("Prov", "Pr", "Prv"),
            listOf(33, 22, 35, 27, 23, 35, 27, 36, 18, 32, 31, 28, 25, 35, 33, 33, 28, 24, 29, 30, 31, 29, 35, 34, 28,
                    28, 27, 28, 27, 33, 31)
    ),
    ECCLESIASTES("Ecclesiastes",
            listOf("Eccles", "Ec", "Ecc", "Qoh", "Qoheleth"),
            listOf(18, 26, 22, 17, 19, 12, 29, 17, 18, 20, 10, 14)
    ),
    SONG_OF_SOLOMON("Song of Solomon",
            listOf("Song", "So", "Canticle of Canticles", "Canticles", "Song of Songs", "SOS"),
            listOf(17, 17, 11, 16, 16, 12, 14, 14)
    ),
    ISAIAH("Isaiah",
            listOf("Isa", "Is"),
            listOf(31, 22, 26, 6, 30, 13, 25, 23, 20, 34, 16, 6, 22, 32, 9, 14, 14, 7, 25, 6, 17, 25, 18, 23, 12, 21,
                    13, 29, 24, 33, 9, 20, 24, 17, 10, 22, 38, 22, 8, 31, 29, 25, 28, 28, 25, 13, 15, 22, 26, 11, 23,
                    15, 12, 17, 13, 12, 21, 14, 21, 22, 11, 12, 19, 11, 25, 24)
    ),
    JEREMIAH("Jeremiah",
            listOf("Jer", "Je", "Jr"),
            listOf(19, 37, 25, 31, 31, 30, 34, 23, 25, 25, 23, 17, 27, 22, 21, 21, 27, 23, 15, 18, 14, 30, 40, 10, 38,
                    24, 22, 17, 32, 24, 40, 44, 26, 22, 19, 32, 21, 28, 18, 16, 18, 22, 13, 30, 5, 28, 7, 47, 39, 46,
                    64, 34)
    ),
    LAMENTATIONS("Lamentations",
            listOf("Lam", "La"),
            listOf(22, 22, 66, 22, 22)
    ),
    EZEKIEL("Ezekiel",
            listOf("Ezek", "Eze", "Ezk"),
            listOf(28, 10, 27, 17, 17, 14, 27, 18, 11, 22, 25, 28, 23, 23, 8, 63, 24, 32, 14, 44, 37, 31, 49, 27, 17,
                    21, 36, 26, 21, 26, 18, 32, 33, 31, 15, 38, 28, 23, 29, 49, 26, 20, 27, 31, 25, 24, 23, 35)
    ),
    DANIEL("Daniel",
            listOf("Dan", "Da", "Dn"),
            listOf(21, 49, 100, 34, 30, 29, 28, 27, 27, 21, 45, 13, 64, 42)
    ),
    HOSEA("Hosea",
            listOf("Hos", "Ho"),
            listOf(9, 25, 5, 19, 15, 11, 16, 14, 17, 15, 11, 15, 15, 10)
    ),
    JOEL("Joel",
            listOf("Joe", "Jl"),
            listOf(20, 27, 5, 21)
    ),
    AMOS("Amos",
            listOf("Am"),
            listOf(15, 16, 15, 13, 27, 14, 17, 14, 15)
    ),
    OBADIAH("Obadiah",
            listOf("Obad", "Ob"),
            listOf(21)
    ),
    JONAH("Jonah",
            listOf("Jnh", "Jon"),
            listOf(16, 11, 10, 11)
    ),
    MICAH("Micah",
            listOf("Mic"),
            listOf(16, 13, 12, 14, 14, 16, 20)
    ),
    NAHUM("Nahum",
            listOf("Nah", "Na"),
            listOf(14, 14, 19)
    ),
    HABAKKUK("Habakkuk",
            listOf("Hab"),
            listOf(17, 20, 19)
    ),
    ZEPHANIAH("Zephaniah",
            listOf("Zeph", "Zep", "Zp"),
            listOf(18, 15, 20)
    ),
    HAGGAI("Haggai",
            listOf("Hag", "Hg"),
            listOf(15, 23)
    ),
    ZECHARIAH("Zechariah",
            listOf("Zech", "Zec", "Zc"),
            listOf(17, 17, 10, 14, 11, 15, 14, 23, 17, 12, 17, 14, 9, 21)
    ),
    MALACHI("Malachi",
            listOf("Mal", "Ml"),
            listOf(14, 17, 24)
    ),
    // New Testament
    MATTHEW("Matthew",
            listOf("Matt", "Mt"),
            listOf(25, 23, 17, 25, 48, 34, 29, 34, 38, 42, 30, 50, 58, 36, 39, 28, 27, 35, 30, 34, 46, 46, 39, 51, 46,
                    75, 66, 20)
    ),
    MARK("Mark",
            listOf("Mrk", "Mk", "Mr"),
            listOf(45, 28, 35, 41, 43, 56, 37, 38, 50, 52, 33, 44, 37, 72, 47, 20)
    ),
    LUKE("Luke",
            listOf("Luk", "Lk"),
            listOf(80, 52, 38, 44, 39, 49, 50, 56, 62, 42, 54, 59, 35, 35, 32, 31, 37, 43, 48, 47, 38, 71, 56, 53)
    ),
    JOHN("John",
            listOf("Jn", "Jhn"),
            listOf(51, 25, 36, 54, 47, 71, 53, 59, 41, 42, 57, 50, 38, 31, 27, 33, 26, 40, 42, 31, 25)
    ),
    ACTS("Acts",
            listOf("Ac"),
            listOf(26, 47, 26, 37, 42, 15, 60, 40, 43, 48, 30, 25, 52, 28, 41, 40, 34, 28, 40, 38, 40, 30, 35, 27, 27,
                    32, 44, 31)
    ),
    ROMANS("Romans",
            listOf("Rom", "Ro", "Rm"),
            listOf(32, 29, 31, 25, 21, 23, 25, 39, 33, 21, 36, 21, 14, 23, 33, 27)
    ),
    FIRST_CORINTHIANS("1 Corinthians",
            listOf("1 Cor", "1 Co", "I Co", "1Co", "I Cor", "1Cor", "I Corinthians", "1Corinthians", "1st Corinthians",
                    "First Corinthians"),
            listOf(31, 16, 23, 21, 13, 20, 40, 13, 27, 33, 34, 31, 13, 40, 58, 24)
    ),
    SECOND_CORINTHIANS("2 Corinthians",
            listOf("2 Cor", "2 Co", "II Co", "2Co", "II Cor", "2Cor", "II Corinthians", "2Corinthians",
                    "2nd Corinthians", "Second Corinthians"),
            listOf(24, 17, 18, 18, 21, 18, 16, 24, 15, 18, 33, 21, 13)
    ),
    GALATIANS("Galatians",
            listOf("Gal", "Ga"),
            listOf(24, 21, 29, 31, 26, 18)
    ),
    EPHESIANS("Ephesians",
            listOf("Ephes", "Eph"),
            listOf(23, 22, 21, 32, 33, 24)
    ),
    PHILIPPIANS("Philippians",
            listOf("Phil", "Php"),
            listOf(30, 30, 21, 23)
    ),
    COLOSSIANS("Colossians",
            listOf("Col"),
            listOf(29, 23, 25, 18)
    ),
    FIRST_THESSALONIANS("1 Thessalonians",
            listOf("1 Thess", "1 Th", "I Th", "1Th", "I Thes", "1Thes", "I Thess", "1Thess", "I Thessalonians",
                    "1Thessalonians", "1st Thessalonians", "First Thessalonians"),
            listOf(10, 20, 13, 18, 28)
    ),
    SECOND_THESSALONIANS("2 Thessalonians",
            listOf("2 Thess", "2 Th", "II Th", "2Th", "II Thes", "2Thes", "II Thess", "2Thess", "II Thessalonians",
                    "2Thessalonians", "2nd Thessalonians", "Second Thessalonians"),
            listOf(12, 17, 18)
    ),
    FIRST_TIMOTHY("1 Timothy",
            listOf("1 Tim", "1 Ti", "I Ti", "1Ti", "I Tim", "1Tim", "I Timothy", "1Timothy", "1st Timothy",
                    "First Timothy"),
            listOf(20, 15, 16, 16, 25, 21)
    ),
    SECOND_TIMOTHY("2 Timothy",
            listOf("2 Tim", "2 Ti", "II Ti", "2Ti", "II Tim", "2Tim", "II Timothy", "2Timothy", "2nd Timothy",
                    "Second Timothy"),
            listOf(18, 26, 17, 22)
    ),
    TITUS("Titus",
            listOf("Tit"),
            listOf(16, 15, 15)
    ),
    PHILEMON("Philemon",
            listOf("Philem", "Phm"),
            listOf(25)
    ),
    HEBREWS("Hebrews",
            listOf("Heb"),
            listOf(14, 18, 19, 16, 14, 20, 28, 13, 28, 39, 40, 29, 25)
    ),
    JAMES("James",
            listOf("Jas", "Jm"),
            listOf(27, 26, 18, 17, 20)
    ),
    FIRST_PETER("1 Peter",
            listOf("1 Pet", "1 Pe", "I Pe", "1Pe", "I Pet", "1Pet", "I Pt", "1 Pt", "1Pt", "I Peter", "1Peter",
                    "1st Peter", "First Peter"),
            listOf(25, 25, 22, 19, 14)
    ),
    SECOND_PETER("2 Peter",
            listOf("2 Pet", "2 Pe", "II Pe", "2Pe", "II Pet", "2Pet", "II Pt", "2 Pt", "2Pt", "II Peter", "2Peter",
                    "2nd Peter", "Second Peter"),
            listOf(21, 22, 18)
    ),
    FIRST_JOHN("1 John",
            listOf("1 John", "1 Jn", "I Jn", "1Jn", "I Jo", "1Jo", "I Joh", "1Joh", "I Jhn", "1 Jhn", "1Jhn", "I John",
                    "1John", "1st John", "First John"),
            listOf(10, 29, 24, 21, 21)
    ),
    SECOND_JOHN("2 John",
            listOf("2 John", "2 Jn", "II Jn", "2Jn", "II Jo", "2Jo", "II Joh", "2Joh", "II Jhn", "2 Jhn", "2Jhn",
                    "II John", "2John", "2nd John", "Second John"),
            listOf(13)
    ),
    THIRD_JOHN("3 John",
            listOf("3 John", "3 Jn", "III Jn", "3Jn", "III Jo", "3Jo", "III Joh", "3Joh", "III Jhn", "3 Jhn", "3Jhn",
                    "III John", "3John", "3rd John", "Third John"),
            listOf(15)
    ),
    JUDE("Jude",
            listOf("Jud"),
            listOf(25)
    ),
    REVELATION("Revelation",
            listOf("Rev", "Re", "The Revelation"),
            listOf(20, 29, 22, 11, 14, 17, 17, 13, 21, 11, 19, 17, 18, 20, 8, 21, 18, 24, 21, 15, 27, 21)
    );

    /**
     * The number of chapters in the Book.
     */
    val chapterCount by lazy { versesPerChapter.size }

    /**
     * @return true if the Book is in the Old Testament.
     */
    fun isOldTestament() = this < MATTHEW

    /**
     * @return true if the chapter exists in the Book.
     */
    fun isValidChapter(chapter: Int): Boolean {
        require(chapter >= 1)
        return chapter <= chapterCount
    }

    /**
     * @return true if the given [chapterRange] exists in this Book.
     */
    fun isValidChapterRange(chapterRange: ClosedRange<Int>)
            = isValidChapter(chapterRange.start) && isValidChapter(chapterRange.endInclusive)

    /**
     * @return true if the given [verse] exists in this Book.
     */
    fun isValid(verse: Verse) = isValidChapter(verse.chapter) &&
            versesInChapter(verse.chapter) >= verse.verseNumber

    /**
     * @return the number of verses in the given [chapter].
     * @throws IndexOutOfBoundsException if the chapter does not exist in this Book.
     */
    @Throws(IndexOutOfBoundsException::class)
    fun versesInChapter(chapter: Int): Int {
        require(chapter > 0)
        if (isValidChapter(chapter)) {
            return versesPerChapter[chapter - 1]
        }
        throw IndexOutOfBoundsException("Chapter $chapter does not exist in $title.")
    }

    companion object {
        /**
         * @return the book corresponding to the given [name].
         * @throws ParseException if there was no matching Book found.
         */
        @Throws(ParseException::class)
        fun parse(name: String) = name.trim().replace(".", "").toLowerCase().let { lowercaseName ->
            findBookNameMatch(lowercaseName) ?: findBookAbbreviationMatch(lowercaseName) ?:
                    throw ParseException("Could not parse book name", 0)
        }

        private fun findBookNameMatch(lowercaseName: String)
                = values().firstOrNull { lowercaseName == it.title.toLowerCase() }

        private fun findBookAbbreviationMatch(lowercaseName: String)
                = values().firstOrNull { it.abbreviations.map { it.toLowerCase() }.contains(lowercaseName) }
    }
}
```

### Example 2

test 2

## Big code hierarchy

### Example 1

test 1

### Example 2

test 2
