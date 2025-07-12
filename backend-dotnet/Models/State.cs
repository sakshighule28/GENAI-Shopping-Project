using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClothingStore.Models
{
    [Table("states")]
    public class State
    {
        [Column("id")]
        public long Id { get; set; }
        
        [Column("name")]
        [Required]
        public string Name { get; set; } = string.Empty;
    }
}