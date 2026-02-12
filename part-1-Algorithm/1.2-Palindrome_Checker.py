IGNORED_CHARACTERS = " .?!,;:-"


# Note: I wrote different implementations just to test how much relying
# on the C code of Python is faster. It turns out the naive approach
# is almost always the fastest. But `is_palindrome_manual_half()` is faster
# when giving a 1000-letter-long non-palindrome.
# Anyway, since we use the function only on small strings, optimisation
# is not really a concern. This was just out of curiosity.


def is_palindrome_naive(word: str) -> bool:
	"""
	Checks if `word` is a palindrome.
	To ignore common characters in a sentence, use `is_sentence_palindrome()` instead.
	"""
	word = word.lower()
	return word == word[::-1]


def is_palindrome_half(word: str) -> bool:
	"""
	Checks if `word` is a palindrome.
	To ignore common characters in a sentence, use `is_sentence_palindrome()` instead.
	"""
	word = word.lower()
	length: int = len(word)
	middle: int = length // 2
	return word[:middle] == word[:length-middle-1:-1]


def is_palindrome_manual_half(word: str) -> bool:
	"""
	Checks if `word` is a palindrome.
	To ignore common characters in a sentence, use `is_sentence_palindrome()` instead.
	"""
	word = word.lower()
	length: int = len(word)
	middle: int = length // 2
	for i in range(middle):
		if word[i] != word[-i-1]:
			return False
	return True

is_palindrome = is_palindrome_naive



def is_character_to_keep(character: str) -> bool:
	return character not in IGNORED_CHARACTERS


def remove_ignored_characters(text: str) -> str:
	return "".join(filter(is_character_to_keep, text))


def is_sentence_palindrome(text: str) -> bool:
	"""
	Checks if `text` is a palindrome.
	Ignores special characters that are common in sentences.
	"""
	return is_palindrome(remove_ignored_characters(text))


if __name__ == "__main__":
	def test():
		EXAMPLES = {
			"abcd": False,
			"abcde": False,
			"abbd": False,
			"kayak": True,
			"abba": True,
			"A man, a plan, a canal: Panama": True,
			"tims": False,
			"abab": False,
			"()()": False,
			"())(": True,
			"a": True,
			"": True,
		}
		
		for text, expected in EXAMPLES.items():
			assert expected == is_sentence_palindrome(text)
	
	test()
	
	
	LONG_PALINDROME = "a" * 10000
	LONG_NON_PALINDROME = "a" * 1000 + "b"
	def profile(text: str):
		for i in range(100000):
			# Python code is 10-100x slower on palindromes
			is_palindrome_manual_half(text)
			is_palindrome_half(text)
			is_palindrome_naive(text)
	
	import cProfile
	cProfile.run('profile(LONG_PALINDROME)')
	
	