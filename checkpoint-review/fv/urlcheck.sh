u="$1"
r=$(curl -s -L -m 25 -o /dev/null -A "Mozilla/5.0 (X11; Linux x86_64) Chrome/124" -w "%{http_code}|%{url_effective}" "$u")
echo "$u	$r"
