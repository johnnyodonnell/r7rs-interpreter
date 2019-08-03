#!/usr/bin/csi -script

(define fib
  (lambda (n)
    (if (< n 3)
      1
      (+ (fib (- n 1)) (fib (- n 2))))))

(print (fib 10))

