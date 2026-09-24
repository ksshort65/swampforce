y=$1
while read id; do
  f=pdf$y/$id.pdf
  [ -s $f ] || curl -sL -A "Mozilla/5.0" --max-time 60 -o $f "https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/$y/$id.pdf"
done < ids$y.txt
