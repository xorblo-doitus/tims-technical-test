FIZZ = 3
BUZZ = 5



def nb_to_message(number: int) -> str|int:
	if number % (FIZZ * BUZZ) == 0:
		return "FizzBuzz"
	elif number % FIZZ == 0:
		return "Fizz"
	elif number % BUZZ == 0:
		return "Buzz"
	return number


def ask_number() -> int:
	while True:
		inputed: str = input("Enter the maximum number to count up to:\n")
		try:
			return int(inputed)
		except ValueError:
			print(f"`{inputed}` is not a valid number. Example valid numbers : 1, 12, or 30")


def main():
	last_number = ask_number()
	
	print("Starting to count:")
	
	for current_number in range(1, last_number):
		print(nb_to_message(current_number))



if __name__ == "__main__":
	def test():
		EXEMPLE = [
			1,
			2,
			"Fizz",
			4,
			"Buzz",
			"Fizz",
			7,
			8,
			"Fizz",
			"Buzz",
			11,
			"Fizz",
			13,
			14,
			"FizzBuzz",
			16,
		]
		
		assert EXEMPLE == list(map(nb_to_message, range(1, 17)))
	
	test()
	main()